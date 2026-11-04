import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT

pdf_path = r"d:\HACKATHONS\paylater-travel\PayLater_Travel_Receipt_154_57EUR.pdf"

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    leftMargin=36,
    rightMargin=36,
    topMargin=36,
    bottomMargin=36
)

styles = getSampleStyleSheet()

# Custom styles
title_style = ParagraphStyle(
    'DocTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=22,
    textColor=colors.HexColor('#171316')
)

brand_style = ParagraphStyle(
    'BrandName',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=colors.HexColor('#1156f9')
)

company_subtext = ParagraphStyle(
    'CompanySub',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#64748b')
)

meta_right_bold = ParagraphStyle(
    'MetaRightBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    alignment=TA_RIGHT,
    textColor=colors.HexColor('#171316')
)

meta_right_sub = ParagraphStyle(
    'MetaRightSub',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=12,
    alignment=TA_RIGHT,
    textColor=colors.HexColor('#64748b')
)

badge_style = ParagraphStyle(
    'Badge',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=11,
    alignment=TA_RIGHT,
    textColor=colors.HexColor('#059669')
)

section_header_style = ParagraphStyle(
    'SectionHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor('#64748b')
)

body_bold = ParagraphStyle(
    'BodyBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#0f172a')
)

body_normal = ParagraphStyle(
    'BodyNormal',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#334155')
)

table_header_style = ParagraphStyle(
    'TableHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.5,
    leading=11,
    textColor=colors.HexColor('#475569')
)

table_amount_style = ParagraphStyle(
    'TableAmount',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    alignment=TA_RIGHT,
    textColor=colors.HexColor('#171316')
)

story = []

# --- 1. HEADER (BRAND + META) ---
header_data = [
    [
        Paragraph("Pay Later <font color='#ff7433'>Travel</font>", brand_style),
        Paragraph("<font color='#059669'>● PAYMENT CONFIRMED</font>", badge_style)
    ],
    [
        Paragraph(
            "Pay Later Travel Pty Ltd • Global Flight Layaway Solutions<br/>"
            "Official Website: <b>www.paylatertravel.com</b><br/>"
            "Support Desk: <b>paylatertravelhelp@gmail.com</b>",
            company_subtext
        ),
        Paragraph(
            "Statement Ref: <b>PLT-TXN-20261104-15457</b><br/>"
            "Operation Date: <b>04/11/2026 at 09:23 GMT</b><br/>"
            "Transaction ID: <b>TRANSFER-2473009189</b>",
            meta_right_sub
        )
    ]
]

header_table = Table(header_data, colWidths=[320, 200])
header_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(header_table)
story.append(Spacer(1, 12))
story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#1156f9'), spaceBefore=0, spaceAfter=14))

# --- 2. DOCUMENT TITLE ---
story.append(Paragraph("Official Flight Layaway Payment Receipt", title_style))
story.append(Spacer(1, 12))

# --- 3. CUSTOMER & PAYMENT SOURCE CARDS ---
grid_data = [
    [
        Paragraph("CUSTOMER & ACCOUNT HOLDER", section_header_style),
        Paragraph("SETTLEMENT & PAYMENT METHOD", section_header_style)
    ],
    [
        Paragraph(
            "<b>Maria Inês Cardoso da Silva</b><br/>"
            "Urbanização Quinta do Morgadinho N8<br/>"
            "8125-307 Quarteira<br/>"
            "Portugal",
            body_normal
        ),
        Paragraph(
            "Bank / Financial Institution: <b>Wise</b> (Wise Europe SA)<br/>"
            "Account Number (IBAN): <b>BE84 9059 2713 1259</b><br/>"
            "SWIFT / BIC: <b>TRWIBEB1XXX</b><br/>"
            "Payment Channel: <b>SEPA Direct Bank Transfer</b>",
            body_normal
        )
    ]
]

grid_table = Table(grid_data, colWidths=[255, 265])
grid_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 12),
    ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ('LINEBELOW', (0,0), (1,0), 0.5, colors.HexColor('#e2e8f0')),
]))
story.append(grid_table)
story.append(Spacer(1, 16))

# --- 4. ITEM DETAILS TABLE ---
table_data = [
    [
        Paragraph("TRANSACTION DESCRIPTION", table_header_style),
        Paragraph("REFERENCE", table_header_style),
        Paragraph("CURRENCY", table_header_style),
        Paragraph("AMOUNT", ParagraphStyle('THRight', parent=table_header_style, alignment=TA_RIGHT))
    ],
    [
        Paragraph(
            "<b>Flight Layaway Installment — Pay Later Travel</b><br/>"
            "<font color='#64748b' size='8'>Installment payment applied toward locked-in flight reservation.<br/>"
            "0% APR Interest • No Credit Check • Price Freeze Guaranteed</font>",
            body_normal
        ),
        Paragraph(
            "<b>TRANSFER-2473009189</b><br/>"
            "<font color='#64748b' size='8'>04/11/2026 at 09:23</font>",
            body_normal
        ),
        Paragraph("EUR", body_bold),
        Paragraph("<b>154,57 €</b>", table_amount_style)
    ]
]

item_table = Table(table_data, colWidths=[260, 140, 50, 70])
item_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
    ('LINEBELOW', (0,0), (-1,0), 1.5, colors.HexColor('#cbd5e1')),
    ('LINEBELOW', (0,1), (-1,1), 1, colors.HexColor('#e2e8f0')),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
]))
story.append(item_table)
story.append(Spacer(1, 10))

# --- 5. TOTALS SUMMARY TABLE ---
totals_data = [
    [
        Paragraph("Installment Subtotal", body_normal),
        Paragraph("154,57 €", ParagraphStyle('TR', parent=body_normal, alignment=TA_RIGHT))
    ],
    [
        Paragraph("Financing / Interest Surcharge (0% APR)", body_normal),
        Paragraph("<font color='#059669'><b>0,00 €</b></font>", ParagraphStyle('TRG', parent=body_normal, alignment=TA_RIGHT))
    ],
    [
        Paragraph("Service / Processing Fee", body_normal),
        Paragraph("<font color='#059669'><b>0,00 €</b></font>", ParagraphStyle('TRG2', parent=body_normal, alignment=TA_RIGHT))
    ],
    [
        Paragraph("<b>Total Amount Processed</b>", ParagraphStyle('TTB', parent=body_bold, textColor=colors.HexColor('#1156f9'))),
        Paragraph("<b>154,57 €</b>", ParagraphStyle('TTBA', parent=body_bold, textColor=colors.HexColor('#1156f9'), alignment=TA_RIGHT))
    ]
]

totals_table = Table(totals_data, colWidths=[180, 80])
totals_table.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#e2e8f0')),
    ('BACKGROUND', (0,3), (-1,3), colors.HexColor('#eff6ff')),
    ('LINEBELOW', (0,0), (-1,2), 0.5, colors.HexColor('#f1f5f9')),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
]))

# Align totals table to the right side
totals_wrapper = Table([[ "", totals_table ]], colWidths=[260, 260])
totals_wrapper.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(totals_wrapper)
story.append(Spacer(1, 16))

# --- 6. POLICY & GUARANTEE NOTE ---
policy_content = Paragraph(
    "<b>Pay Later Travel Flight Layaway Confirmation & Guarantee:</b><br/>"
    "• This receipt acknowledges that payment of <b>154,57 €</b> was received from <b>Maria Inês Cardoso da Silva</b> "
    "via Wise electronic bank settlement on <b>04/11/2026 at 09:23 GMT</b>.<br/>"
    "• Your flight booking seats remain locked and confirmed. Current airfare pricing is frozen and guaranteed.<br/>"
    "• Confirmed airline itinerary e-ticket with airline PNR will be delivered to your email within 24 hours of completing your final installment.<br/>"
    "• For any questions or payment inquiries, email our support team at: <b>paylatertravelhelp@gmail.com</b>.",
    company_subtext
)
policy_table = Table([[policy_content]], colWidths=[520])
policy_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fffdf7')),
    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fed7aa')),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 12),
    ('RIGHTPADDING', (0,0), (-1,-1), 12),
]))
story.append(policy_table)
story.append(Spacer(1, 20))

# --- 7. FOOTER ---
footer_data = [
    [
        Paragraph("✈️ <b>Pay Later Travel</b> • IATA Accredited Travel Agent • Reg No. 0713629988", ParagraphStyle('FLeft', parent=styles['Normal'], fontSize=8, textColor=colors.HexColor('#64748b'))),
        Paragraph("Generated on 04/11/2026 • Page 1 of 1", ParagraphStyle('FRight', parent=styles['Normal'], fontSize=8, alignment=TA_RIGHT, textColor=colors.HexColor('#94a3b8')))
    ]
]
footer_table = Table(footer_data, colWidths=[360, 160])
footer_table.setStyle(TableStyle([
    ('LINEABOVE', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(footer_table)

doc.build(story)
print(f"Generated PDF successfully: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
