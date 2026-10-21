/* ==========================================================================
   Chudhary PERFUMES (Chudharyperfumes.com)
   SUPABASE REAL-TIME CLOUD DATABASE & INVENTORY SYNCHRONIZATION SYSTEM
   ========================================================================== */

const CloudDB = {
  CONFIG_KEY: 'cp_supabase_config',

  // Retrieve current Supabase Configuration (from localStorage or embedded default)
  getConfig() {
    try {
      const cfg = JSON.parse(localStorage.getItem(this.CONFIG_KEY)) || {};
      const url = (cfg.url || window.CH_SUPABASE_URL || '').trim().replace(/\/+$/, '');
      const key = (cfg.key || window.CH_SUPABASE_KEY || '').trim();
      return {
        url: url,
        key: key,
        enabled: !!(url && key)
      };
    } catch(e) {
      return { url: '', key: '', enabled: false };
    }
  },

  // Save Supabase Configuration
  saveConfig(url, key) {
    const cleanUrl = (url || '').trim().replace(/\/+$/, '');
    const cleanKey = (key || '').trim();
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify({ url: cleanUrl, key: cleanKey }));
  },

  isConnected() {
    return this.getConfig().enabled;
  },

  getHeaders() {
    const cfg = this.getConfig();
    return {
      'apikey': cfg.key,
      'Authorization': `Bearer ${cfg.key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  },

  /* --------------------------------------------------------------------------
     1. ORDERS SYNCHRONIZATION (Save, Retrieve, Update Status, Delete)
     -------------------------------------------------------------------------- */

  // Save new customer order (called upon checkout submission)
  async saveOrder(order) {
    // 1. Always cache in localStorage for instant local availability
    try {
      const placed = JSON.parse(localStorage.getItem('cp_placed_orders')) || [];
      const exists = placed.find(o => (o.id || o.orderId) === order.id);
      if (!exists) {
        placed.unshift(order);
        localStorage.setItem('cp_placed_orders', JSON.stringify(placed));
      }
    } catch(e) {}

    const cfg = this.getConfig();
    if (!cfg.enabled) {
      console.info('Supabase cloud sync not configured. Order saved in local registry.');
      return { success: true, localOnly: true };
    }

    // 2. Map front-end order object to Supabase PostgreSQL table columns
    const row = {
      id: order.id || order.orderId,
      order_id: order.orderId || order.id,
      customer_name: order.customerName,
      phone: order.phone,
      email: order.email || '',
      city: order.city,
      address: order.address,
      notes: order.notes || '',
      items: typeof order.items === 'string' ? order.items : JSON.stringify(order.items),
      total: Number(order.total) || 0,
      payment_method: order.paymentMethod,
      payment_title: order.paymentTitle || '',
      trx_id: order.trxId || '',
      payment_proof: order.paymentProof || '',
      date: order.date || new Date().toISOString(),
      status: order.status || 'Pending COD',
      courier_partner: order.courierPartner || 'PostEx Courier'
    };

    try {
      const res = await fetch(`${cfg.url}/rest/v1/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(row)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Supabase order upload error:', errText);
        return { success: false, error: errText };
      }

      console.log(`✓ Order ${row.id} successfully saved to Supabase Cloud Database!`);
      return { success: true, cloud: true };
    } catch(err) {
      console.error('Network error uploading order to Supabase:', err);
      return { success: false, error: err.message };
    }
  },

  // Retrieve all orders (called by Admin Panel & Polling loop)
  async getOrders() {
    const cfg = this.getConfig();
    if (!cfg.enabled) {
      try {
        return JSON.parse(localStorage.getItem('cp_placed_orders')) || [];
      } catch(e) {
        return [];
      }
    }

    try {
      const res = await fetch(`${cfg.url}/rest/v1/orders?select=*&order=created_at.desc`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (res.ok) {
        const rows = await res.json();
        const cloudOrders = rows.map(r => ({
          id: r.id || r.order_id,
          orderId: r.order_id || r.id,
          customerName: r.customer_name,
          phone: r.phone,
          email: r.email,
          city: r.city,
          address: r.address,
          notes: r.notes,
          items: r.items,
          total: Number(r.total),
          paymentMethod: r.payment_method,
          paymentTitle: r.payment_title,
          trxId: r.trx_id,
          paymentProof: r.payment_proof,
          date: r.date,
          status: r.status,
          courierPartner: r.courier_partner || 'PostEx Courier',
          createdAt: r.created_at
        }));

        // Keep local cache synced
        localStorage.setItem('cp_placed_orders', JSON.stringify(cloudOrders));
        return cloudOrders;
      }
    } catch(err) {
      console.warn('Could not reach Supabase, serving cached orders:', err);
    }

    try {
      return JSON.parse(localStorage.getItem('cp_placed_orders')) || [];
    } catch(e) {
      return [];
    }
  },

  // Update order status (called by Admin dropdown change)
  async updateOrderStatus(orderId, newStatus) {
    // 1. Local update
    try {
      const placed = JSON.parse(localStorage.getItem('cp_placed_orders')) || [];
      const found = placed.find(o => (o.id || o.orderId) === orderId);
      if (found) {
        found.status = newStatus;
        localStorage.setItem('cp_placed_orders', JSON.stringify(placed));
      }
      const hist = JSON.parse(localStorage.getItem('cp_order_history')) || [];
      const hFound = hist.find(h => (h.id || h.orderId) === orderId);
      if (hFound) {
        hFound.status = newStatus;
        localStorage.setItem('cp_order_history', JSON.stringify(hist));
      }
    } catch(e) {}

    const cfg = this.getConfig();
    if (!cfg.enabled) return;

    try {
      await fetch(`${cfg.url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      console.log(`✓ Status of Order ${orderId} synced to Supabase: ${newStatus}`);
    } catch(err) {
      console.error('Error updating order status on Supabase:', err);
    }
  },

  // Delete an order
  async deleteOrder(orderId) {
    try {
      const placed = JSON.parse(localStorage.getItem('cp_placed_orders')) || [];
      const filtered = placed.filter(o => (o.id || o.orderId) !== orderId);
      localStorage.setItem('cp_placed_orders', JSON.stringify(filtered));
    } catch(e) {}

    const cfg = this.getConfig();
    if (!cfg.enabled) return;

    try {
      await fetch(`${cfg.url}/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
    } catch(err) {
      console.error('Error deleting order on Supabase:', err);
    }
  },

  /* --------------------------------------------------------------------------
     2. REAL-TIME INVENTORY SYNCHRONIZATION
     -------------------------------------------------------------------------- */

  // Retrieve current inventory stock
  async getInventory(defaultInv = []) {
    const cfg = this.getConfig();
    if (!cfg.enabled) {
      try {
        return JSON.parse(localStorage.getItem('cp_inventory')) || defaultInv;
      } catch(e) {
        return defaultInv;
      }
    }

    try {
      const res = await fetch(`${cfg.url}/rest/v1/inventory?select=*&order=id.asc`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          const cloudInv = rows.map(r => ({
            id: r.id,
            name: r.name,
            price: Number(r.price),
            stock: Number(r.stock),
            category: r.category
          }));
          localStorage.setItem('cp_inventory', JSON.stringify(cloudInv));
          return cloudInv;
        }
      }
    } catch(err) {
      console.warn('Could not reach Supabase inventory, using local cache:', err);
    }

    try {
      return JSON.parse(localStorage.getItem('cp_inventory')) || defaultInv;
    } catch(e) {
      return defaultInv;
    }
  },

  // Update product stock (called by Admin stock adjustment buttons)
  async updateStock(productId, newStock) {
    try {
      const inv = JSON.parse(localStorage.getItem('cp_inventory')) || [];
      const found = inv.find(p => p.id === productId);
      if (found) {
        found.stock = newStock;
        localStorage.setItem('cp_inventory', JSON.stringify(inv));
      }
    } catch(e) {}

    const cfg = this.getConfig();
    if (!cfg.enabled) return;

    try {
      await fetch(`${cfg.url}/rest/v1/inventory?id=eq.${encodeURIComponent(productId)}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ stock: newStock, updated_at: new Date().toISOString() })
      });
      console.log(`✓ Stock for ${productId} updated in Supabase to ${newStock} units`);
    } catch(err) {
      console.error('Error updating stock on Supabase:', err);
    }
  },

  // Deduct stock when customer places an order
  async deductStock(items) {
    if (!Array.isArray(items)) return;
    const inv = await this.getInventory();

    for (const item of items) {
      const found = inv.find(p => p.id === item.id || p.name.toLowerCase() === item.name.toLowerCase());
      if (found && typeof found.stock === 'number') {
        const newStock = Math.max(0, found.stock - item.quantity);
        await this.updateStock(found.id, newStock);
      }
    }
  },

  /* --------------------------------------------------------------------------
     3. TEST CONNECTION & INITIAL SETUP
     -------------------------------------------------------------------------- */
  async testConnection(url, key) {
    const cleanUrl = (url || '').trim().replace(/\/+$/, '');
    const cleanKey = (key || '').trim();
    if (!cleanUrl || !cleanKey) return { ok: false, error: 'Project URL and Anon API Key are required' };

    try {
      const res = await fetch(`${cleanUrl}/rest/v1/orders?select=id&limit=1`, {
        method: 'GET',
        headers: {
          'apikey': cleanKey,
          'Authorization': `Bearer ${cleanKey}`
        }
      });

      if (res.ok) {
        return { ok: true };
      } else {
        const msg = await res.text();
        return { ok: false, error: msg || `HTTP ${res.status}` };
      }
    } catch(err) {
      return { ok: false, error: err.message };
    }
  }
};
