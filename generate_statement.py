import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_LEFT

pdf_path = r"d:\HACKATHONS\paylater-travel\PayLater_Travel_Customer_Statement.pdf"

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    leftMargin=40,
    rightMargin=40,
    topMargin=45,
    bottomMargin=40
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'MainTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=22,
    leading=26,
    textColor=colors.HexColor('#000000')
)

period_style = ParagraphStyle(
    'PeriodStyle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    textColor=colors.HexColor('#000000')
)

sub_style = ParagraphStyle(
    'SubStyle',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#555555')
)

col_header_style = ParagraphStyle(
    'ColHeader',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    textColor=colors.HexColor('#000000')
)

cell_text_bold = ParagraphStyle(
    'CellBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9.5,
    leading=13,
    textColor=colors.HexColor('#000000')
)

cell_text = ParagraphStyle(
    'CellText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    textColor=colors.HexColor('#222222')
)

cell_text_right = ParagraphStyle(
    'CellRight',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9,
    leading=13,
    alignment=TA_RIGHT,
    textColor=colors.HexColor('#222222')
)

cell_text_right_bold = ParagraphStyle(
    'CellRightBold',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=9,
    leading=13,
    alignment=TA_RIGHT,
    textColor=colors.HexColor('#000000')
)

footer_legal_style = ParagraphStyle(
    'FooterLegal',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=11.5,
    textColor=colors.HexColor('#555555')
)

page_num_style = ParagraphStyle(
    'PageNum',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8,
    leading=11,
    alignment=TA_RIGHT,
    textColor=colors.HexColor('#555555')
)

story = []

# --- 1. TITLE & DATES ---
story.append(Paragraph("Pay Later Travel Statement", title_style))
story.append(Spacer(1, 14))

story.append(Paragraph("3 November 2026 [GMT] - 4 November 2026 [GMT]", period_style))
story.append(Spacer(1, 4))
story.append(Paragraph("Generated on: 4 November 2026", sub_style))
story.append(Spacer(1, 24))

# --- 2. ACCOUNT HOLDER & IDENTIFIERS ---
holder_info = (
    "<b>Maria Inês Cardoso da Silva</b><br/>"
    "Urbanização Quinta do Morgadinho N8<br/>"
    "Quarteira<br/>"
    "8125-307<br/>"
    "Portugal"
)

holder_table_data = [
    [
        Paragraph("Account Holder", col_header_style),
        Paragraph("Customer ID", col_header_style),
        Paragraph("Account Reference", col_header_style)
    ],
    [
        Paragraph(holder_info, cell_text),
        Paragraph("PLT-849059", cell_text),
        Paragraph("PLT-REC-202611", cell_text)
    ]
]

holder_table = Table(holder_table_data, colWidths=[240, 140, 135])
holder_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(holder_table)
story.append(Spacer(1, 16))
story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#d1d5db'), spaceBefore=0, spaceAfter=18))

# --- 3. BALANCE BANNER ---
balance_banner_data = [
    [
        Paragraph("<b>EUR on 4 November 2026 [GMT]</b>", ParagraphStyle('BalTitle', fontName='Helvetica-Bold', fontSize=12, leading=15)),
        Paragraph("<b>154.57 EUR</b>", ParagraphStyle('BalAmount', fontName='Helvetica-Bold', fontSize=12, leading=15, alignment=TA_RIGHT))
    ]
]
balance_table = Table(balance_banner_data, colWidths=[350, 165])
balance_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
]))
story.append(balance_table)
story.append(Spacer(1, 6))

# --- 4. TRANSACTIONS LEDGER TABLE ---
tx_table_data = [
    [
        Paragraph("Description", ParagraphStyle('TH1', fontName='Helvetica', fontSize=8.5, textColor=colors.HexColor('#6b7280'))),
        Paragraph("Incoming", ParagraphStyle('TH2', fontName='Helvetica', fontSize=8.5, alignment=TA_RIGHT, textColor=colors.HexColor('#6b7280'))),
        Paragraph("Outgoing", ParagraphStyle('TH3', fontName='Helvetica', fontSize=8.5, alignment=TA_RIGHT, textColor=colors.HexColor('#6b7280'))),
        Paragraph("Amount", ParagraphStyle('TH4', fontName='Helvetica', fontSize=8.5, alignment=TA_RIGHT, textColor=colors.HexColor('#6b7280')))
    ],
    [
        Paragraph(
            "<b>Flight layaway installment payment received</b> with reference<br/>"
            "<font color='#6b7280' size='8'>04 November 2026 | Transaction: PLT-TRANSFER-2473009189</font>",
            cell_text
        ),
        Paragraph("154.57", cell_text_right),
        Paragraph("", cell_text_right),
        Paragraph("154.57", cell_text_right_bold)
    ]
]

tx_table = Table(tx_table_data, colWidths=[315, 65, 65, 70])
tx_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('LINEBELOW', (0,0), (-1,0), 0.5, colors.HexColor('#e5e7eb')),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(tx_table)
story.append(Spacer(1, 40))

# --- 5. LEGAL & CONTACT FOOTNOTE ---
disclaimer_text = (
    "Pay Later Travel Pty Ltd is an online travel reservation and layaway service provider. "
    "All flight bookings and scheduled installments are governed by the Pay Later Travel booking agreement. "
    "Payments are held toward confirmed airline ticket issuance upon completion of scheduled layaway plans.<br/><br/>"
    "Need help? Contact support at <b>paylatertravelhelp@gmail.com</b> or visit <b>www.paylatertravel.com</b>"
)
story.append(Paragraph(disclaimer_text, footer_legal_style))
story.append(Spacer(1, 160))

# --- 6. PAGE BOTTOM NUMBER ---
footer_meta_data = [
    [
        Paragraph("<font color='#9ca3af' size='7'>ref:plt-84905927131259-20261104</font>", ParagraphStyle('MetaRef', fontName='Helvetica', fontSize=7, textColor=colors.HexColor('#9ca3af'))),
        Paragraph("1 / 1", page_num_style)
    ]
]
footer_meta_table = Table(footer_meta_data, colWidths=[350, 165])
footer_meta_table.setStyle(TableStyle([
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('BOTTOMPADDING', (0,0), (-1,-1), 0),
]))
story.append(footer_meta_table)

doc.build(story)
print(f"Generated PDF: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
