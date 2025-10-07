// Naza Cleaning Service Invoice - JavaScript Functionality

class InvoiceApp {
    constructor() {
        this.initializeElements();
        this.initializeValues();
        this.bindEvents();
    }

    // Initialize DOM element references
    initializeElements() {
        this.invoiceNo = document.querySelector('#invoiceNo');
        this.invoiceDate = document.querySelector('#invoiceDate');
        this.dueDate = document.querySelector('#dueDate');
        this.grandTotal = document.querySelector('#grandTotal');
        this.subTotal = document.querySelector('#subTotal');
        this.printArea = document.querySelector('#printArea');
        this.invoiceDisplay = document.querySelector('#invoiceDisplay');
        this.dateDisplay = document.querySelector('#dateDisplay');
        this.previewBtn = document.querySelector('#previewBtn');
        this.resetBtn = document.querySelector('#resetForm');
        this.clientName = document.querySelector('#clientName');
        this.clientAddress = document.querySelector('#clientAddress');
        this.clientEmail = document.querySelector('#clientEmail');
    }

    // Initialize form values
    initializeValues() {
        const now = new Date();
        
        // Generate invoice number
        this.invoiceNo.value = 'INV-' + 
            now.getFullYear().toString().slice(2) + '-' + 
            this.pad(Math.floor(Math.random() * 900 + 100));
        
        // Set dates
        this.invoiceDate.value = now.toISOString().slice(0, 10);
        const due = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days due date
        this.dueDate.value = due.toISOString().slice(0, 10);
        
        // Update header display
        this.updateHeaderDisplay();
    }

    // Bind event listeners
    bindEvents() {
        // Amount fields change events
        document.querySelectorAll('.amount').forEach(element => {
            element.addEventListener('input', () => this.calculateTotal());
            element.addEventListener('blur', () => this.formatAmountField(element));
        });

        // Invoice details change events
        this.invoiceNo.addEventListener('input', () => this.updateHeaderDisplay());
        this.invoiceDate.addEventListener('input', () => this.updateHeaderDisplay());

        // Button events
        this.previewBtn.addEventListener('click', () => this.generatePrintPreview());
        this.resetBtn.addEventListener('click', () => this.resetForm());

        // Initial calculation
        this.calculateTotal();
    }

    // Utility function to pad numbers
    pad(n) {
        return String(n).padStart(3, '0');
    }

    // Format currency for Nigerian Naira
    formatCurrency(n) {
        return '₦' + Number(n || 0).toLocaleString('en-NG', { maximumFractionDigits: 2 });
    }

    // Format amount field on blur
    formatAmountField(element) {
        const value = this.extractNumericValue(element.textContent);
        element.textContent = this.formatCurrency(value);
    }

    // Extract numeric value from text
    extractNumericValue(text) {
        return Number(String(text).replace(/[^0-9.]/g, '')) || 0;
    }

    // Calculate total amounts
    calculateTotal() {
        let total = 0;
        document.querySelectorAll('.amount').forEach(element => {
            const value = this.extractNumericValue(element.textContent);
            total += value;
        });
        
        this.subTotal.textContent = this.formatCurrency(total);
        this.grandTotal.textContent = this.formatCurrency(total);
    }

    // Update header display when form values change
    updateHeaderDisplay() {
        this.invoiceDisplay.textContent = `Invoice Number: ${this.invoiceNo.value}`;
        this.dateDisplay.textContent = `Date: ${this.invoiceDate.value}`;
    }

    // Validate form before generating preview
    validateForm() {
        const errors = [];
        
        if (!this.clientName.value.trim()) {
            errors.push('Client name is required');
        }
        
        if (!this.invoiceNo.value.trim()) {
            errors.push('Invoice number is required');
        }
        
        if (!this.invoiceDate.value) {
            errors.push('Invoice date is required');
        }
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return false;
        }
        
        return true;
    }

    // Generate services table HTML for print
    generateServicesTableHTML() {
        return Array.from(document.querySelectorAll('#itemsBody tr'))
            .map((row, index) => {
                const amount = row.children[3].textContent;
                return amount !== '₦0' ? `
                    <tr style="border-bottom:1px solid #eee">
                        <td style="padding:12px 15px;font-size:14px">${index + 1}</td>
                        <td style="padding:12px 15px;font-size:14px;font-weight:500">${row.children[1].textContent}</td>
                        <td style="padding:12px 15px;font-size:14px;text-align:right">${amount}</td>
                        <td style="padding:12px 15px;font-size:14px;text-align:right;font-weight:bold;color:#000">${amount}</td>
                    </tr>
                ` : '';
            })
            .filter(row => row)
            .join('');
    }

    // Generate print preview
    generatePrintPreview() {
        if (!this.validateForm()) {
            return;
        }

        this.calculateTotal();
        
        const printHTML = `
            <div style="font-family:'Segoe UI',Arial,sans-serif;background:white;color:#333;margin:0;padding:0">
                <!-- Professional Header with Wave Design -->
                <div style="position:relative;background:linear-gradient(135deg, #000000 0%, #333 100%);color:white;padding:40px 30px 60px;overflow:hidden">
                    <div style="position:absolute;bottom:-2px;left:0;width:100%;height:30px;background:#FFD700;clip-path:ellipse(100% 100% at 50% 0%)"></div>
                    <div style="position:relative;z-index:2">
                        <div style="display:flex;justify-content:space-between;align-items:start">
                            <div>
                                <div style="width:60px;height:60px;background:#FFD700;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#000;font-weight:bold;font-size:14px;margin-bottom:15px;overflow:hidden">
                                    <img src="logo.jpg" alt="Naza Cleaning Service" style="width:100%;height:100%;object-fit:cover;border-radius:8px" onerror="this.style.display='none'; this.parentNode.innerHTML='LOGO'">
                                </div>
                                <div style="font-size:28px;font-weight:bold;margin-bottom:5px">NAZA CLEANING SERVICE</div>
                                <div style="color:#FFD700;font-size:14px;margin-bottom:10px">Professional Cleaning Solutions</div>
                                <div style="color:#ccc;font-size:12px;line-height:1.4">
                                    Lagos Island Orchid<br>
                                    Victoria Crest 2 Estate<br>
                                    House 4 Pacific Shelter
                                </div>
                            </div>
                            <div style="text-align:right">
                                <h1 style="font-size:36px;font-weight:300;margin:0 0 5px 0">INVOICE</h1>
                                <div style="font-size:14px;color:#FFD700">${this.invoiceNo.value}</div>
                                <div style="font-size:12px;color:#ccc">${this.invoiceDate.value}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Invoice Body -->
                <div style="padding:30px">
                    <!-- Bill To and Payment Info -->
                    <div style="display:flex;gap:30px;margin-bottom:30px">
                        <div style="flex:1">
                            <div style="background:#f5f5f5;padding:20px;border-radius:8px">
                                <h4 style="color:#000;margin:0 0 10px 0;font-size:14px;font-weight:bold">BILL TO:</h4>
                                <p style="margin:5px 0;font-weight:bold;font-size:16px">${this.clientName.value}</p>
                                <p style="margin:5px 0;font-size:14px">${this.clientAddress.value || ''}</p>
                                <p style="margin:5px 0;font-size:14px">${this.clientEmail.value}</p>
                            </div>
                        </div>
                        <div style="flex:0 0 250px">
                            <div style="background:#f5f5f5;padding:15px;border-radius:8px">
                                <h4 style="color:#000;margin:0 0 10px 0;font-size:14px;font-weight:bold">PAYMENT INFORMATION:</h4>
                                <p style="margin:3px 0;font-size:12px"><strong>Bank:</strong> OPay</p>
                                <p style="margin:3px 0;font-size:12px"><strong>Name:</strong> Nwameli Chinaza Cynthia</p>
                                <p style="margin:3px 0;font-size:12px"><strong>Account:</strong> 9030882494</p>
                            </div>
                            <div style="margin-top:15px;text-align:right">
                                <p style="margin:3px 0;font-size:12px"><strong>Invoice Date:</strong> ${this.invoiceDate.value}</p>
                                <p style="margin:3px 0;font-size:12px"><strong>Due Date:</strong> ${this.dueDate.value}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Services Table -->
                    <div style="border:1px solid #ddd;border-radius:8px;overflow:hidden;margin-bottom:20px">
                        <table style="width:100%;border-collapse:collapse">
                            <thead style="background:#000;color:white">
                                <tr>
                                    <th style="padding:15px;text-align:left;font-weight:bold;font-size:12px;width:60px">ITEM</th>
                                    <th style="padding:15px;text-align:left;font-weight:bold;font-size:12px">DESCRIPTION</th>
                                    <th style="padding:15px;text-align:right;font-weight:bold;font-size:12px;width:100px">RATE</th>
                                    <th style="padding:15px;text-align:right;font-weight:bold;font-size:12px;width:100px">AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateServicesTableHTML()}
                            </tbody>
                        </table>
                    </div>

                    <!-- Totals -->
                    <div style="max-width:300px;margin-left:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
                        <div style="display:flex;justify-content:space-between;padding:10px 15px;border-bottom:1px solid #eee">
                            <span>Sub Total:</span>
                            <span>${this.subTotal.textContent}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;padding:10px 15px;border-bottom:1px solid #eee">
                            <span>Sales Tax:</span>
                            <span>₦0</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;padding:15px;background:#000;color:white;font-weight:bold;font-size:16px">
                            <span>TOTAL:</span>
                            <span>${this.grandTotal.textContent}</span>
                        </div>
                    </div>

                    <!-- Terms -->
                    <div style="margin-top:30px;font-size:12px;color:#666">
                        <h4 style="color:#000;margin-bottom:10px">TERMS AND CONDITIONS:</h4>
                        <p>Payment is due 30 days from the invoice date.</p>
                    </div>
                </div>
            </div>
        `;
        
        this.printArea.innerHTML = printHTML;
        window.print();
    }

    // Reset form to initial state
    resetForm() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            location.reload();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InvoiceApp();
});