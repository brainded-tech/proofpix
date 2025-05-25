# 🔧 DNS Fix Guide - Upload Subdomain & Cleanup

## 🚨 **CRITICAL: Add Upload Subdomain**

### **Add This Record in Cloudflare:**
```
Type: A
Name: upload
Content: 172.66.0.70
Proxy status: Proxied
TTL: Auto
```

This will make `upload.proofpixapp.com` point to the same server as your main domain.

## 🧹 **Cleanup Old Zoho Records (Optional)**

Since you're using Cloudflare Email Routing now, you can delete these old Zoho records:

### **Delete These Records:**
```
❌ TXT proofpixapp.com "zoho-verification=zb12914442.zmverify.zoho.com"
❌ TXT zmail._domainkey "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMukhlE+tpNqK+3VIckiYRKeudjV5Vhyo/31+CB0y1Mj3o0Ml39DD7Apcstacau9hx0pkoE0eX3kq71CgJ/Ddw74NOGSujEey1oKM6qX7eW1BPkQt48HKRU8CJ3OC+W6xn64I2Pd7SYnz+9+oMHQi9BILLhKPbWIbh2Mxz67Z4VQIDAQAB"
```

## ✅ **Your DNS Should Look Like This After Fix:**

### **A Records:**
```
✅ A proofpixapp.com → 172.66.0.70 (Proxied)
✅ A upload → 172.66.0.70 (Proxied) ← ADD THIS
✅ A blog → 159.89.237.156 (Proxied)
```

### **MX Records (Email):**
```
✅ MX proofpixapp.com → route1.mx.cloudflare.net (Priority 72)
✅ MX proofpixapp.com → route2.mx.cloudflare.net (Priority 6)
✅ MX proofpixapp.com → route3.mx.cloudflare.net (Priority 39)
```

### **TXT Records (Email):**
```
✅ TXT proofpixapp.com → "v=spf1 include:_spf.mx.cloudflare.net ~all"
✅ TXT cf2024-1._domainkey → [DKIM record]
```

## 🎯 **Steps to Fix:**

1. **In Cloudflare Dashboard:**
   - Go to DNS → Records
   - Click "Add record"
   - Type: A
   - Name: upload
   - IPv4 address: 172.66.0.70
   - Proxy status: Proxied
   - Click "Save"

2. **Test After 5 Minutes:**
   ```bash
   curl -I https://upload.proofpixapp.com
   ```

3. **Should Return:**
   ```
   HTTP/2 200
   server: cloudflare
   ```

## 🚀 **After This Fix:**
- ✅ upload.proofpixapp.com will work
- ✅ Your app will be accessible
- ✅ Ready for marketing launch! 