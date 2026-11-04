from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import os

pdf_path = r"d:\HACKATHONS\paylater-travel\PayLater_Travel_Statement_Exact.pdf"

# A4 dimensions: 595.28 x 841.89 points
PAGE_WIDTH, PAGE_HEIGHT = A4

c = canvas.Canvas(pdf_path, pagesize=A4)

# Y helper (from top margin)
def y_top(y):
    return PAGE_HEIGHT - y

# Exact Margins derived from reference image (7.3% margin)
LEFT_M = 44.0
RIGHT_M = PAGE_WIDTH - 44.0
CONTENT_W = RIGHT_M - LEFT_M

# 1. "EUR statement"
y_pos = 50.0
c.setFont("Helvetica-Bold", 19)
c.setFillColor(colors.HexColor("#000000"))
c.drawString(LEFT_M, y_top(y_pos), "EUR statement")

# 2. Date Range: "4 November 2026 [GMT] - 4 November 2026 [GMT]"
y_pos += 26.0
c.setFont("Helvetica-Bold", 10.0)
c.setFillColor(colors.HexColor("#000000"))
c.drawString(LEFT_M, y_top(y_pos), "4 November 2026 [GMT] - 4 November 2026 [GMT]")

# 3. "Generated on: 4 November 2026 at 09:23"
y_pos += 18.0
c.setFont("Helvetica", 8.5)
c.setFillColor(colors.HexColor("#6b7280"))
c.drawString(LEFT_M, y_top(y_pos), "Generated on: 4 November 2026 at 09:23")

# Divider 1 (Hairline above metadata)
y_pos += 20.0
c.setStrokeColor(colors.HexColor("#e5e7eb"))
c.setLineWidth(0.6)
c.line(LEFT_M, y_top(y_pos), RIGHT_M, y_top(y_pos))

# 4. Three Column Metadata
# Col 1: Account Holder (starts at LEFT_M)
# Col 2: IBAN (x = 305)
# Col 3: Swift/BIC (x = 428)
y_pos += 18.0
c.setFont("Helvetica-Bold", 9.0)
c.setFillColor(colors.HexColor("#000000"))
c.drawString(LEFT_M, y_top(y_pos), "Account Holder")
c.drawString(305, y_top(y_pos), "IBAN")
c.drawString(428, y_top(y_pos), "Swift/BIC")

# Values
c.setFont("Helvetica", 8.5)
c.setFillColor(colors.HexColor("#111827"))
line_spacing = 13.0

y_val = y_pos + 15.0
c.drawString(LEFT_M, y_top(y_val), "Maria Inês Cardoso da Silva")
c.drawString(305, y_top(y_val), "BE84 9059 2713 1259")
c.drawString(428, y_top(y_val), "TRWIBEB1XXX")

y_val += line_spacing
c.drawString(LEFT_M, y_top(y_val), "Urbanização Quinta do Morgadinho N8")

y_val += line_spacing
c.drawString(LEFT_M, y_top(y_val), "Quarteira")

y_val += line_spacing
c.drawString(LEFT_M, y_top(y_val), "8125-307")

y_val += line_spacing
c.drawString(LEFT_M, y_top(y_val), "Portugal")

# Divider 2 (Hairline below Portugal)
y_pos = y_val + 18.0
c.setStrokeColor(colors.HexColor("#e5e7eb"))
c.setLineWidth(0.6)
c.line(LEFT_M, y_top(y_pos), RIGHT_M, y_top(y_pos))

# 5. Balance Bar: "EUR on 4 November 2026 [GMT]" & "154.57 EUR"
y_pos += 24.0
c.setFont("Helvetica-Bold", 12.0)
c.setFillColor(colors.HexColor("#000000"))
c.drawString(LEFT_M, y_top(y_pos), "EUR on 4 November 2026 [GMT]")

bal_text = "154.57 EUR"
bal_w = c.stringWidth(bal_text, "Helvetica-Bold", 12.0)
c.drawString(RIGHT_M - bal_w, y_top(y_pos), bal_text)

# Divider 3 (Solid grey line under balance)
y_pos += 12.0
c.setStrokeColor(colors.HexColor("#9ca3af"))
c.setLineWidth(0.75)
c.line(LEFT_M, y_top(y_pos), RIGHT_M, y_top(y_pos))

# 6. Table Headers: Description, Incoming, Outgoing, Amount
y_pos += 14.0
c.setFont("Helvetica", 8.0)
c.setFillColor(colors.HexColor("#6b7280"))
c.drawString(LEFT_M, y_top(y_pos), "Description")

# Header X positions (Right aligned columns)
X_INC_RIGHT = 398.0
X_OUT_RIGHT = 460.0
X_AMT_RIGHT = RIGHT_M

w_inc = c.stringWidth("Incoming", "Helvetica", 8.0)
w_out = c.stringWidth("Outgoing", "Helvetica", 8.0)
w_amt = c.stringWidth("Amount", "Helvetica", 8.0)

c.drawString(X_INC_RIGHT - w_inc, y_top(y_pos), "Incoming")
c.drawString(X_OUT_RIGHT - w_out, y_top(y_pos), "Outgoing")
c.drawString(X_AMT_RIGHT - w_amt, y_top(y_pos), "Amount")

# 7. Table Row Content
y_pos += 18.0
c.setFont("Helvetica", 8.5)
c.setFillColor(colors.HexColor("#000000"))
c.drawString(LEFT_M, y_top(y_pos), "Flight payment from Maria Inês Cardoso da Silva with")

# Amounts aligned to headers
amt_val = "154.57"
w_val = c.stringWidth(amt_val, "Helvetica", 8.5)
c.drawString(X_INC_RIGHT - w_val, y_top(y_pos), amt_val)
c.drawString(X_AMT_RIGHT - w_val, y_top(y_pos), amt_val)

y_pos += 11.5
c.drawString(LEFT_M, y_top(y_pos), "reference")

y_pos += 13.0
c.setFont("Helvetica", 7.5)
c.setFillColor(colors.HexColor("#6b7280"))
c.drawString(LEFT_M, y_top(y_pos), "4 November 2026 at 09:23 | Transaction: TRANSFER-2473009189")

# 8. Legal Disclaimer
y_pos += 46.0
c.setFont("Helvetica", 7.0)
c.setFillColor(colors.HexColor("#6b7280"))
c.drawString(LEFT_M, y_top(y_pos), "Pay Later Travel is the trading name of Pay Later Travel Pty Ltd, an accredited travel reservation service.")
y_pos += 10.5
c.drawString(LEFT_M, y_top(y_pos), "All flight tickets and scheduled payment installments are subject to Pay Later Travel terms and conditions.")
y_pos += 16.0
c.drawString(LEFT_M, y_top(y_pos), "Need help? Visit paylatertravel.com or contact support at paylatertravelhelp@gmail.com")

# 9. Page Footer
c.setFont("Helvetica", 6.8)
c.setFillColor(colors.HexColor("#9ca3af"))
c.drawString(LEFT_M, 36.0, "ref:86998590-148b-4510-a7d2-5eb27f5fecf4")

page_str = "1 / 1"
w_page = c.stringWidth(page_str, "Helvetica", 6.8)
c.drawString(RIGHT_M - w_page, 36.0, page_str)

c.save()
print(f"Statement generated: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
