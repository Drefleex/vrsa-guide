import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/pins.js', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
header_lines = []
pin_lines = []
footer_lines = []

in_array = False
array_done = False
for line in lines:
    stripped = line.strip()
    if not in_array:
        if 'export const DEFAULT_PINS = [' in line:
            in_array = True
            header_lines.append(line)
        else:
            header_lines.append(line)
    elif in_array and not array_done:
        if stripped == ']' or stripped == '];':
            array_done = True
            footer_lines.append(line)
        elif stripped.startswith('{id:'):
            pin_lines.append(stripped.rstrip(','))
    else:
        footer_lines.append(line)

# Parse each pin line into a dict
def parse_pin(line):
    m = re.match(r'\{id:(\d+),name:"((?:[^"\\]|\\.)*)",emoji:"((?:[^"\\]|\\.)*)",cat:"([^"]*)",color:"([^"]*)",lat:([^,]+),lng:([^}]+)\}', line)
    if m:
        return {
            'id': int(m.group(1)),
            'name': m.group(2),
            'emoji': m.group(3),
            'cat': m.group(4),
            'color': m.group(5),
            'lat': m.group(6).strip(),
            'lng': m.group(7).strip(),
        }
    return None

pins = {}
for line in pin_lines:
    p = parse_pin(line)
    if p:
        pins[p['id']] = p
    else:
        print(f'FAILED TO PARSE: {line[:100]}', file=sys.stderr)

print(f'Parsed {len(pins)} pins', file=sys.stderr)

# ---- STEP 1: REMOVE pins ----
remove_ids = {279, 262, 252, 244, 228, 216, 211, 125, 110, 108, 16, 12, 106, 105, 104, 107, 221, 103, 119, 117, 116, 115, 223, 225, 222, 224, 219, 301, 236, 235, 234, 233, 232, 230, 227, 231, 229, 249, 246, 245, 241, 256, 255, 253, 251, 250, 247, 243, 240, 239, 238, 220, 260, 259, 257, 124, 111, 271, 269, 267, 258, 268, 8, 10, 118, 121, 122, 284, 283, 273, 129, 286, 288, 285, 126, 290, 128, 217, 291, 266, 263, 123, 261, 272, 130, 276, 2, 218, 114, 292, 298, 100, 300, 13, 112, 102, 202, 201, 204, 203, 205, 5, 278, 206, 207, 6, 215, 214, 138, 212, 277, 136, 135, 134, 209, 133, 132, 275, 131, 357, 385, 411, 423, 446, 451, 474, 492}

not_found_remove = remove_ids - set(pins.keys())
print(f'Remove IDs not found in file: {sorted(not_found_remove)}', file=sys.stderr)

for rid in remove_ids:
    if rid in pins:
        del pins[rid]

print(f'After removal: {len(pins)} pins', file=sys.stderr)

# ---- STEP 2: UPDATE coordinates ----
updates = {
    106: (37.179932, -7.409828),
    107: (37.181307, -7.410362),
    105: (37.18088, -7.410107),
    221: (37.187991, -7.411979),
    103: (37.18606, -7.411474),
    116: (37.191, -7.416979),
    117: (37.193, -7.417989),
    115: (37.191, -7.417),
    225: (37.190521, -7.417043),
    222: (37.19, -7.417),
    224: (37.190418, -7.416367),
    219: (37.192, -7.415),
    235: (37.193, -7.416),
    232: (37.193, -7.416),
    246: (37.194, -7.417),
    245: (37.194, -7.417),
    253: (37.194, -7.416),
    238: (37.194, -7.416),
    220: (37.194, -7.416),
    260: (37.194, -7.415),
    118: (37.191915, -7.42),
    273: (37.197017, -7.422893),
    286: (37.196, -7.42),
    288: (37.197, -7.418),
    285: (37.196, -7.42),
    217: (37.199, -7.419),
    272: (37.199, -7.415),
    2: (37.187, -7.416),
    218: (37.188983, -7.417),
    114: (37.189, -7.415),
    292: (37.186556, -7.412594),
    300: (37.192948, -7.413357),
    13: (37.192, -7.413),
    202: (37.168966, -7.403),
    201: (37.168034, -7.403),
    204: (37.171, -7.411),
    203: (37.17, -7.406914),
    212: (37.189, -7.438),
    277: (37.185, -7.436),
    136: (37.19, -7.435828),
    135: (37.19, -7.435),
    134: (37.191, -7.433),
    209: (37.191, -7.43),
    132: (37.192, -7.426),
    275: (37.198863, -7.427656),
    131: (37.195, -7.426),
    304: (37.189257, -7.415265),
    331: (37.197525, -7.415139),
    330: (37.197467, -7.415525),
    372: (37.194776, -7.415289),
    327: (37.195489, -7.414805),
    404: (37.193456, -7.416334),
    415: (37.19391, -7.419786),
    417: (37.19441, -7.419472),
    418: (37.194108, -7.419434),
    421: (37.194021, -7.420185),
    424: (37.19401, -7.420723),
    428: (37.195088, -7.420406),
    433: (37.196361, -7.421001),
    437: (37.196865, -7.420014),
    439: (37.196926, -7.419648),
    438: (37.196646, -7.419761),
    441: (37.197076, -7.41868),
    443: (37.197451, -7.418098),
    457: (37.197949, -7.423728),
    459: (37.198853, -7.417716),
    463: (37.193223, -7.421401),
    464: (37.193925, -7.421291),
    479: (37.195132, -7.42798),
    480: (37.19555, -7.427446),
    481: (37.196382, -7.427375),
    482: (37.192582, -7.427019),
    484: (37.192717, -7.426409),
    485: (37.192288, -7.426728),
    492: (37.191549, -7.43045),
    495: (37.191724, -7.43129),
    496: (37.191351, -7.433183),
    509: (37.188471, -7.444012),
    510: (37.188594, -7.4448),
    513: (37.188145, -7.446727),
    514: (37.187735, -7.446646),
    515: (37.187829, -7.450884),
    530: (37.183066, -7.471271),
    531: (37.183921, -7.471267),
}

updated_count = 0
not_found_update = []
for uid, (lat, lng) in updates.items():
    if uid in pins:
        pins[uid]['lat'] = str(lat)
        pins[uid]['lng'] = str(lng)
        updated_count += 1
    else:
        not_found_update.append(uid)

print(f'Updated {updated_count} pins coords', file=sys.stderr)
if not_found_update:
    print(f'Update coord IDs not found (will be added as new): {sorted(not_found_update)}', file=sys.stderr)

# ---- STEP 3: ADD new pins ----
# These are tuples: (name, emoji, cat, color, lat, lng)
new_pins_list = [
    (292, "Associação de Pescadores Santo António de Arenilha", "🍽️", "restaurante", "#D32F2F", 37.186932, -7.412186),
    (293, "Jofica-caixilharia Lda.", "🏪", "loja", "#7C3AED", 37.185967, -7.413877),
    (294, "Santo António", "🍽️", "restaurante", "#D32F2F", 37.179815, -7.409867),
    (295, "Dom Petisco", "🍽️", "restaurante", "#D32F2F", 37.180807, -7.410128),
    (296, "A Ribeirinha", "🍽️", "restaurante", "#D32F2F", 37.181191, -7.410393),
    (297, "Restaurante CateQuero", "🍽️", "restaurante", "#D32F2F", 37.181779, -7.410403),
    (298, "Ksa de Praia Algarve", "🏨", "hotel", "#AD1457", 37.188431, -7.412526),
    (299, "Escultura", "🏛️", "cultura", "#1565C0", 37.19029, -7.412499),
    (300, "Associação Naval do Guadiana", "🍽️", "restaurante", "#D32F2F", 37.192948, -7.413357),
    (301, "Padaria Vila e Mar", "☕", "pastelaria", "#5D4037", 37.192987, -7.415306),
    (303, "Ksa de Praia Algarve", "🏨", "hotel", "#AD1457", 37.188431, -7.412526),
    (304, "O Cisne", "🍽️", "restaurante", "#D32F2F", 37.189189, -7.415168),
    (305, "Farol de Vila Real de Santo António", "🏛️", "cultura", "#1565C0", 37.187148, -7.416437),
    (306, "Continente Bom Dia Vila Real de Santo António", "🛒", "mercado", "#1B5E20", 37.189352, -7.417588),
    (307, "Estádio Municipal de Vila Real de Santo António", "🏛️", "cultura", "#1565C0", 37.188575, -7.418836),
    (308, "Associação Naval do Guadiana", "🍽️", "restaurante", "#D32F2F", 37.192948, -7.413357),
    (309, "Os Arcos", "🍽️", "restaurante", "#D32F2F", 37.193318, -7.414088),
    (310, "Padaria Vila e Mar", "🍽️", "restaurante", "#D32F2F", 37.192987, -7.415306),
    (311, "Puro Café", "☕", "pastelaria", "#5D4037", 37.19411, -7.415921),
    (312, "Bella Napoli", "🍕", "pizzaria", "#C62828", 37.19391, -7.41751),
    (313, "Café Paraiso", "🍽️", "restaurante", "#D32F2F", 37.195382, -7.416133),
    (314, "Dom Churrasco", "🍽️", "restaurante", "#D32F2F", 37.191243, -7.417635),
    (315, "KAZAMI SUSHI", "🍣", "sushi", "#BE123C", 37.193075, -7.418406),
    (316, "A Papoila", "🍽️", "restaurante", "#D32F2F", 37.194272, -7.419045),
    (317, "Restaurante Jin", "🍽️", "restaurante", "#D32F2F", 37.193616, -7.418955),
    (318, "Bom Gosto Snack Bar & Take Away", "🍽️", "restaurante", "#D32F2F", 37.192441, -7.414571),
    (319, "Boa Praça", "☕", "pastelaria", "#5D4037", 37.191993, -7.413176),
    (320, "Cafetaria Foz", "☕", "pastelaria", "#5D4037", 37.189068, -7.412667),
    (321, "Padaria e Pastelaria Vila em Romaria", "☕", "pastelaria", "#5D4037", 37.18907, -7.414836),
    (322, "Grand Beach Club", "🍽️", "restaurante", "#D32F2F", 37.180135, -7.409503),
    (323, "Parque Aventura Vila Real de Santo António", "🌿", "natureza", "#2E7D32", 37.186698, -7.420153),
    (324, "Água Salgada - Marisqueira Seafood", "🍽️", "restaurante", "#D32F2F", 37.194147, -7.414389),
    (325, "Trinca-Dela", "🍽️", "restaurante", "#D32F2F", 37.194007, -7.414908),
    (326, "Cuca", "🍽️", "restaurante", "#D32F2F", 37.194444, -7.416192),
    (327, "Bordoy Grand House Algarve", "🏨", "hotel", "#AD1457", 37.195468, -7.414833),
    (328, "Loja", "🍦", "gelataria", "#D81B60", 37.194524, -7.417683),
    (329, "Caçarola", "🍽️", "restaurante", "#D32F2F", 37.196484, -7.414736),
    (330, "Cantarinha do Guadiana", "🍽️", "restaurante", "#D32F2F", 37.197461, -7.415474),
    (331, "Parking Bus Vila Real Santo António", "🅿️", "parking", "#1565C0", 37.19752, -7.415142),
    (332, "Delícia", "🍽️", "restaurante", "#D32F2F", 37.197356, -7.415441),
    (333, "Taskinha La rep", "🍽️", "restaurante", "#D32F2F", 37.197564, -7.415553),
    (334, "Vila Real Santo Antonio-guadiana", "🏛️", "cultura", "#1565C0", 37.197435, -7.414736),
    (335, "Cais de Embarque Transguadiana", "🚌", "transporte", "#4A148C", 37.196958, -7.414003),
    (336, "PSP - Esquadra de Vila Real de Santo António", "👮", "policia", "#1D4ED8", 37.196821, -7.414532),
    (337, "Restaurante Porto de Recreio", "🍽️", "restaurante", "#D32F2F", 37.196586, -7.414354),
    (338, "Estação de Serviço Repsol", "⛽", "combustivel", "#E65100", 37.196411, -7.414869),
    (339, "Quiosque Guadiana", "🛍️", "compras", "#6A1B9A", 37.19666, -7.4149),
    (340, "Vila Real De Santo Antonio", "🚌", "transporte", "#4A148C", 37.197016, -7.415024),
    (341, "VRS António (Terminal Rodoviário)", "🚌", "transporte", "#4A148C", 37.197031, -7.414956),
    (342, "LNHOUSE", "🏨", "hotel", "#AD1457", 37.197714, -7.415861),
    (343, 'Tapearia e Marisqueira "Bernardos"', "🍽️", "restaurante", "#D32F2F", 37.197685, -7.4161),
    (344, "Temperos iconicos", "🍽️", "restaurante", "#D32F2F", 37.197653, -7.416182),
    (345, "Villa Marquez Rooms & Apartments", "🏨", "hotel", "#AD1457", 37.196605, -7.415932),
    (346, "Café Cabo Verde", "☕", "pastelaria", "#5D4037", 37.196504, -7.415185),
    (347, "PALACETE - Legacy lodge", "🏨", "hotel", "#AD1457", 37.196799, -7.415356),
    (348, "Pombaline Building W/Pool by LovelyStay", "🏨", "hotel", "#AD1457", 37.196904, -7.415525),
    (349, "Lanidor Woman", "🏪", "loja", "#7C3AED", 37.196025, -7.415644),
    (350, "Galeria Arte António Vicente Cardoso", "🏛️", "cultura", "#1565C0", 37.19576, -7.415888),
    (351, "Casa Paquita", "🏪", "loja", "#7C3AED", 37.195523, -7.415507),
    (352, "Casa Feira da Louça", "🏪", "loja", "#7C3AED", 37.195498, -7.415676),
    (353, "Café Bar Taberna", "🍺", "bar", "#B45309", 37.195435, -7.416738),
    (354, "Boutique De Noivas", "🏪", "loja", "#7C3AED", 37.195378, -7.416811),
    (355, "Est. Romi", "🏪", "loja", "#7C3AED", 37.195268, -7.41695),
    (356, "Farmácia Carmo", "💊", "farmacia", "#00695C", 37.195166, -7.416214),
    (357, "Sol Dourado", "🍽️", "restaurante", "#D32F2F", 37.194894, -7.416121),
    (359, "Cantinho Do Marquês", "🍽️", "restaurante", "#D32F2F", 37.194671, -7.416058),
    (360, "Restaurante 2000", "🍽️", "restaurante", "#D32F2F", 37.194609, -7.416248),
    (361, "Monumental", "🍽️", "restaurante", "#D32F2F", 37.194524, -7.415919),
    (362, "O Coração do Marquês", "🍽️", "restaurante", "#D32F2F", 37.194477, -7.415959),
    (363, "Moderna", "🍽️", "restaurante", "#D32F2F", 37.19433, -7.41605),
    (364, "A casa do peixe assado", "🍽️", "restaurante", "#D32F2F", 37.194262, -7.416123),
    (365, "NUTTY - Creperia & Iogurteria", "🍦", "gelataria", "#D81B60", 37.194685, -7.416364),
    (366, "Taberna Moleiro", "🍽️", "restaurante", "#D32F2F", 37.194569, -7.41633),
    (367, "Só Marisco", "🍽️", "restaurante", "#D32F2F", 37.19453, -7.416349),
    (368, "Presépio Gigante", "🏛️", "cultura", "#1565C0", 37.194466, -7.416425),
    (369, "Centro Cultural António Aleixo", "🏛️", "cultura", "#1565C0", 37.194387, -7.416416),
    (370, "Praça Marquês de Pombal", "🏛️", "cultura", "#1565C0", 37.194565, -7.415509),
    (371, "Maria's Clayworks", "🏪", "loja", "#7C3AED", 37.194533, -7.415214),
    (372, "Rica Cortiça", "🏪", "loja", "#7C3AED", 37.194768, -7.41529),
    (373, "Hippie-kraampje", "🏪", "loja", "#7C3AED", 37.194884, -7.415506),
    (374, "Snoepgoedkraam", "🏪", "loja", "#7C3AED", 37.194815, -7.415808),
    (375, "Pousada Vila Real de Santo António", "🏨", "hotel", "#AD1457", 37.194279, -7.415575),
    (376, "Caixa Geral De Depositos", "🏦", "banco", "#0D47A1", 37.194225, -7.415479),
    (377, "Los palacios y Villafranca", "🍽️", "restaurante", "#D32F2F", 37.194129, -7.41563),
    (378, "Casa Segura", "🏪", "loja", "#7C3AED", 37.194989, -7.415778),
    (379, "Casa Simon", "🏪", "loja", "#7C3AED", 37.194938, -7.415543),
    (380, "Feira da Louça - Loja Outlet", "🏪", "loja", "#7C3AED", 37.195081, -7.415414),
    (381, "Igreja de Nossa Senhora da Encarnação", "🏛️", "cultura", "#1565C0", 37.194914, -7.415695),
    (382, "Gelatieri", "🍦", "gelataria", "#D81B60", 37.195318, -7.415475),
    (383, "Rally", "🍽️", "restaurante", "#D32F2F", 37.195295, -7.415151),
    (384, "Petisqueira Pataco", "🍽️", "restaurante", "#D32F2F", 37.195361, -7.414759),
    (385, "Bordoy Grand House Algarve", "🏨", "hotel", "#AD1457", 37.195468, -7.414833),
    (386, "O Coração da Cidade", "🍽️", "restaurante", "#D32F2F", 37.194593, -7.416722),
    (387, "Arenilha", "🍽️", "restaurante", "#D32F2F", 37.194383, -7.416709),
    (388, "Caravela Tescoma", "🏪", "loja", "#7C3AED", 37.194332, -7.41661),
    (389, "Vanilla Cocktails & Snacks", "🍺", "bar", "#B45309", 37.194209, -7.416575),
    (390, "Taska da Vila", "🍽️", "restaurante", "#D32F2F", 37.194145, -7.416557),
    (391, "Fresco & Frito", "🍽️", "restaurante", "#D32F2F", 37.194086, -7.416655),
    (392, "Bistro - Bar Latté", "🍺", "bar", "#B45309", 37.194058, -7.416761),
    (393, "Supermercado Corvo", "🛒", "mercado", "#1B5E20", 37.19402, -7.416531),
    (394, "Foto Cale", "🏪", "loja", "#7C3AED", 37.194426, -7.417061),
    (395, "Delhi's Belly Restaurante", "🍽️", "restaurante", "#D32F2F", 37.194262, -7.416995),
    (396, "Chocolateria Ambre", "🍽️", "restaurante", "#D32F2F", 37.194021, -7.416985),
    (397, "Green Buddha VRSA", "🍽️", "restaurante", "#D32F2F", 37.193917, -7.416885),
    (398, "Cervejaria Lisboeta", "🍺", "bar", "#B45309", 37.19405, -7.417151),
    (399, "Pastelaria Caseira", "☕", "pastelaria", "#5D4037", 37.194082, -7.41728),
    (400, "Klassik Gelataria", "🍦", "gelataria", "#D81B60", 37.194043, -7.41756),
    (401, "Arenilha Guest House", "🏨", "hotel", "#AD1457", 37.193586, -7.416741),
    (402, "Low Cost", "🏨", "hotel", "#AD1457", 37.193781, -7.416599),
    (403, "Restaurante Villareal", "🍽️", "restaurante", "#D32F2F", 37.193746, -7.416479),
    (404, "Camarata Room", "🏨", "hotel", "#AD1457", 37.193435, -7.416355),
    (405, "Sweet Spot", "☕", "pastelaria", "#5D4037", 37.193402, -7.416726),
    (406, "Supermercado Filho", "🛒", "mercado", "#1B5E20", 37.193387, -7.417197),
    (407, "Casa Das Bonecas", "🏨", "hotel", "#AD1457", 37.193199, -7.416859),
    (408, "Hotel Apolo", "🏨", "hotel", "#AD1457", 37.193645, -7.420111),
    (409, "Nice Pastelaria", "☕", "pastelaria", "#5D4037", 37.193837, -7.419183),
    (410, "A Padaria", "☕", "pastelaria", "#5D4037", 37.193928, -7.420507),
    (411, "Meio Limão Bio", "🍽️", "restaurante", "#D32F2F", 37.194425, -7.419928),
    (412, "O Vezinho - Vila Real de Santo António", "☕", "pastelaria", "#5D4037", 37.194557, -7.420102),
    (413, "Meio Limão Bio", "🍽️", "restaurante", "#D32F2F", 37.194425, -7.419928),
    (414, "Centro Óptico do Sul", "🏪", "loja", "#7C3AED", 37.194054, -7.419588),
    (415, "Kiko kids", "🏪", "loja", "#7C3AED", 37.193878, -7.419783),
    (416, "Livraria Lusíada", "🏪", "loja", "#7C3AED", 37.193996, -7.419963),
    (417, "Quintalão", "🏛️", "cultura", "#1565C0", 37.194395, -7.419481),
    (418, "Centro Auditivo Audika - Vila Real de Santo António", "🏪", "loja", "#7C3AED", 37.194132, -7.419451),
    (419, "Pastelaria La Suisse", "☕", "pastelaria", "#5D4037", 37.19396, -7.419517),
    (420, "Amigo do Mel", "🏪", "loja", "#7C3AED", 37.193887, -7.419843),
    (421, "Loja Oriente", "🏪", "loja", "#7C3AED", 37.193988, -7.420253),
    (422, "BPI Vila Real de Santo António", "🏦", "banco", "#0D47A1", 37.194168, -7.420227),
    (423, "Superpreço", "🛒", "mercado", "#1B5E20", 37.194015, -7.420731),
    (424, "Auchan", "🛒", "mercado", "#1B5E20", 37.194015, -7.420731),
    (425, "Monumento ao Poeta Antonio Aleixo", "🏛️", "cultura", "#1565C0", 37.193703, -7.420909),
    (426, "António Vítor Dias Da Silva & Filha Lda", "🏪", "loja", "#7C3AED", 37.194325, -7.420497),
    (427, "Snack Bar O Petisco", "🍽️", "restaurante", "#D32F2F", 37.194856, -7.420339),
    (428, "Clizone | Vila Real de Santo António", "🏥", "saude", "#00838F", 37.195089, -7.420351),
    (429, "FRESH NAAN KEBAB", "🌯", "kebab", "#6D4C41", 37.194649, -7.421087),
    (430, "Taberna Ponto de Encontro", "🍽️", "restaurante", "#D32F2F", 37.195167, -7.421465),
    (431, "snack-bar JB", "🍽️", "restaurante", "#D32F2F", 37.194569, -7.421703),
    (432, "O Gelito", "🍦", "gelataria", "#D81B60", 37.196394, -7.420784),
    (433, "IEFP", "🏢", "estado", "#37474F", 37.196347, -7.42101),
    (434, "So se já! Gastro Café", "🍽️", "restaurante", "#D32F2F", 37.196697, -7.420685),
    (435, "VRS António (Secundária)", "🚌", "transporte", "#4A148C", 37.196702, -7.4209),
    (436, "VRS António (Secundária)", "🚌", "transporte", "#4A148C", 37.196837, -7.42082),
    (437, "Serviço de Finanças de Vila Real de Santo António", "🏢", "estado", "#37474F", 37.196844, -7.420013),
    (438, "Luís M Menezes Barragão", "☕", "pastelaria", "#5D4037", 37.19662, -7.419832),
    (439, "Retiro dos Caçadores", "☕", "pastelaria", "#5D4037", 37.196917, -7.419649),
    (440, "Apartamento T2 para férias em Vila Real de Santo António", "🏨", "hotel", "#AD1457", 37.196775, -7.419081),
    (441, "Crispim", "☕", "pastelaria", "#5D4037", 37.197062, -7.418696),
    (442, "Casa Benfica Vila Real de Santo António", "🍽️", "restaurante", "#D32F2F", 37.197349, -7.418531),
    (443, "EVA Transportes", "🚌", "transporte", "#4A148C", 37.197437, -7.4181),
    (444, "Pastelaria - Atelier Macmamã", "☕", "pastelaria", "#5D4037", 37.197218, -7.418174),
    (445, "Ginásio Academia Desportiva Friends e Family-Vila Real de Santo António", "🏥", "saude", "#00838F", 37.19761, -7.417422),
    (446, "Vensover-distribuição De Proutos Alimentares, Lda.", "🏪", "loja", "#7C3AED", 37.197676, -7.417068),
    (447, "Intermarché Vila Real de Santo António", "🛒", "mercado", "#1B5E20", 37.1997, -7.419059),
    (448, "Tasquinha da Muralha", "🍽️", "restaurante", "#D32F2F", 37.200178, -7.414701),
    (449, "Parque de Autocaravanas de Vila Real de Santo António", "🅿️", "parking", "#1565C0", 37.199406, -7.415079),
    (450, "Hot Street Sushi", "🍣", "sushi", "#BE123C", 37.20004, -7.419664),
    (451, "Estação de Trem Vila Real Santo Antonio", "🚌", "transporte", "#4A148C", 37.199844, -7.421574),
    (452, "Vila Real de Santo Antonio", "🚌", "transporte", "#4A148C", 37.199735, -7.421465),
    (453, "Snake Bar Sabor Da vila", "🍽️", "restaurante", "#D32F2F", 37.199232, -7.421174),
    (454, "Coração Doce", "☕", "pastelaria", "#5D4037", 37.198597, -7.419554),
    (455, "Tapas & Companhia", "🍽️", "restaurante", "#D32F2F", 37.198244, -7.419989),
    (456, "O Ratinho", "🍽️", "restaurante", "#D32F2F", 37.198314, -7.420443),
    (457, "Zona ferroviária de vila real de Santo António", "🏛️", "cultura", "#1565C0", 37.197911, -7.423733),
    (458, "Urbanização Rias Parque", "🏨", "hotel", "#AD1457", 37.197529, -7.423291),
    (459, "Casa Casarão", "🍽️", "restaurante", "#D32F2F", 37.198721, -7.417686),
    (460, "Burger Ranch", "🍔", "hamburgaria", "#E65100", 37.193238, -7.420972),
    (461, "Pastelaria Casarão", "☕", "pastelaria", "#5D4037", 37.192916, -7.420707),
    (462, "grelha real", "🍽️", "restaurante", "#D32F2F", 37.19269, -7.420927),
    (463, "Estação de carregamento Galp", "⚡", "carregador", "#16A34A", 37.193155, -7.42139),
    (464, "Farmácia Pombalina", "💊", "farmacia", "#00695C", 37.193865, -7.421307),
    (465, "Mercado Municipal", "🛒", "mercado", "#1B5E20", 37.194219, -7.421403),
    (466, "VRS António (Bombeiros)", "🚌", "transporte", "#4A148C", 37.192428, -7.4204),
    (467, "VRS António (Bombeiros)", "🚌", "transporte", "#4A148C", 37.192409, -7.42053),
    (468, "Café Bar Cantinho Da Jéh", "☕", "pastelaria", "#5D4037", 37.1923, -7.420525),
    (469, "Café Velo", "☕", "pastelaria", "#5D4037", 37.192332, -7.420118),
    (470, "Estação de carregamento EDP Comercial", "⚡", "carregador", "#16A34A", 37.192008, -7.420096),
    (471, "Snack-Bar dos Bombeiros", "🍽️", "restaurante", "#D32F2F", 37.191763, -7.420404),
    (472, "Salinas do Sapal de Cunha de Eça", "🏛️", "cultura", "#1565C0", 37.19925, -7.428083),
    (473, "Painel informativo território museu", "🏛️", "cultura", "#1565C0", 37.197722, -7.427085),
    (474, "Pastelaria Danica", "☕", "pastelaria", "#5D4037", 37.193968, -7.427921),
    (475, "A Barquinha", "🍽️", "restaurante", "#D32F2F", 37.195441, -7.426179),
    (476, "Café Pastelaria O Sonho", "☕", "pastelaria", "#5D4037", 37.19406, -7.427941),
    (477, "Pastelaria Danica", "☕", "pastelaria", "#5D4037", 37.193968, -7.427921),
    (478, "Bar Colombofila Hortense", "🍺", "bar", "#B45309", 37.194723, -7.42782),
    (479, "Bolinhas de Berlim Joaquim Ferramacho", "☕", "pastelaria", "#5D4037", 37.195104, -7.428036),
    (480, "Clínica De Cardiologia Veloso Gomes, Lda.", "🏥", "saude", "#00838F", 37.195552, -7.427467),
    (481, "Casa de Pasto João Brito", "🍽️", "restaurante", "#D32F2F", 37.196354, -7.427383),
    (482, "Shopping Star. HUA TA LI", "🏪", "loja", "#7C3AED", 37.192631, -7.427059),
    (483, "Esséncia", "🏪", "loja", "#7C3AED", 37.192393, -7.427348),
    (484, "Flor das Amendoeiras", "🍽️", "restaurante", "#D32F2F", 37.192691, -7.426412),
    (485, "O Bolo Caseiro", "🍽️", "restaurante", "#D32F2F", 37.192273, -7.426653),
    (486, "Estacionamento Subterrâneo do Continente Modelo", "🅿️", "parking", "#1565C0", 37.191712, -7.429155),
    (487, "Estação de carregamento Continente Plug&Charge", "⚡", "carregador", "#16A34A", 37.19173, -7.429505),
    (488, "BAGGA Vila Real de Santo António", "🍽️", "restaurante", "#D32F2F", 37.191683, -7.429773),
    (489, "Continente Modelo Vila Real de Santo António", "🛒", "mercado", "#1B5E20", 37.191562, -7.429724),
    (490, "MOBI.E Charging Station", "⚡", "carregador", "#16A34A", 37.191397, -7.430052),
    (491, "Pingo Doce Vila Real de Santo António", "🛒", "mercado", "#1B5E20", 37.191086, -7.430439),
    (492, "Hortas (Supermercado)", "🚌", "transporte", "#4A148C", 37.191549, -7.43045),
    (493, "Autocarro", "🚌", "transporte", "#4A148C", 37.191549, -7.43045),
    (494, "Praceta do limoeiro", "🏨", "hotel", "#AD1457", 37.190494, -7.431741),
    (495, "Casa das Hortas", "🏨", "hotel", "#AD1457", 37.191708, -7.431317),
    (496, "Burger King", "🍔", "hamburgaria", "#E65100", 37.19133, -7.433183),
    (497, "Hortas (Monte Tamissa)", "🚌", "transporte", "#4A148C", 37.19094, -7.43389),
    (498, "Hortas (Monte Tamissa)", "🚌", "transporte", "#4A148C", 37.19087, -7.43364),
    (499, "McDonald's", "🍔", "hamburgaria", "#E65100", 37.190338, -7.435854),
    (500, "EDP Comercial Charging Station", "⚡", "carregador", "#16A34A", 37.190053, -7.436051),
    (501, "A Casota", "🍽️", "restaurante", "#D32F2F", 37.190402, -7.436524),
    (502, "Hortas (Casota)", "🚌", "transporte", "#4A148C", 37.18996, -7.43825),
    (503, "Hortas (Casota)", "🚌", "transporte", "#4A148C", 37.189881, -7.43822),
    (504, "UFitness Hotel", "🏨", "hotel", "#AD1457", 37.189318, -7.438486),
    (505, "Hortas (Estação Elevatória)", "🚌", "transporte", "#4A148C", 37.189167, -7.44193),
    (506, "Hortas (Estação Elevatória)", "🚌", "transporte", "#4A148C", 37.189065, -7.44185),
    (507, "Centrauto - Vila Real Santo António", "🏪", "loja", "#7C3AED", 37.18906, -7.442911),
    (508, "Hiper China - Chunchao Guo", "🏪", "loja", "#7C3AED", 37.189084, -7.44327),
    (509, "Hotel Quinta Da Rosa Linda", "🏨", "hotel", "#AD1457", 37.188467, -7.444013),
    (510, "Hostel Boutique Marisol", "🏨", "hotel", "#AD1457", 37.188598, -7.444805),
    (511, "Pastelaria Andrade", "☕", "pastelaria", "#5D4037", 37.188268, -7.445187),
    (512, "Hortas (Urb. Vila Verde)", "🚌", "transporte", "#4A148C", 37.188278, -7.44599),
    (513, "Restaurante Chave D' Ouro", "🍽️", "restaurante", "#D32F2F", 37.18819, -7.446751),
    (514, "Hospedaria Santa Maria Adelaide", "🏨", "hotel", "#AD1457", 37.187735, -7.446612),
    (515, "VILA FORMOSA - al", "🏨", "hotel", "#AD1457", 37.187812, -7.450905),
    (516, "Monte Gordo (X N125)", "🚌", "transporte", "#4A148C", 37.186449, -7.45125),
    (517, "Monte Gordo (X N125)", "🚌", "transporte", "#4A148C", 37.186415, -7.45109),
    (518, "Estação de Serviço Repsol", "⛽", "combustivel", "#E65100", 37.186667, -7.453667),
    (519, "Monte Fino", "🚌", "transporte", "#4A148C", 37.186005, -7.4556),
    (520, "Monte Fino", "🚌", "transporte", "#4A148C", 37.186096, -7.4558),
    (521, "Nature&Beach house", "🏨", "hotel", "#AD1457", 37.186105, -7.45652),
    (522, "Algarve House Monte Gordo", "🏨", "hotel", "#AD1457", 37.186032, -7.456849),
    (523, "Aldeia Nova (Noras)", "🚌", "transporte", "#4A148C", 37.184997, -7.4608),
    (524, "Aldeia Nova (Noras)", "🚌", "transporte", "#4A148C", 37.184868, -7.46075),
    (525, "Restaurante Anita", "🍽️", "restaurante", "#D32F2F", 37.184077, -7.465039),
    (526, "Aldeia Nova (EB1)", "🚌", "transporte", "#4A148C", 37.183793, -7.46562),
    (527, "Aldeia Nova (EB1)", "🚌", "transporte", "#4A148C", 37.183581, -7.46727),
    (528, "bp", "⛽", "combustivel", "#E65100", 37.18358, -7.470398),
    (529, "BP", "⛽", "combustivel", "#E65100", 37.183994, -7.470362),
    (530, "Restaurante Real Pão", "🍽️", "restaurante", "#D32F2F", 37.183053, -7.471325),
    (531, "Rotunda das Apreensões", "🏛️", "cultura", "#1565C0", 37.183895, -7.471262),
]

added = 0
overwritten = []
for entry in new_pins_list:
    nid, name, emoji, cat, color, lat, lng = entry
    if nid in pins:
        overwritten.append(nid)
    pins[nid] = {
        'id': nid,
        'name': name,
        'emoji': emoji,
        'cat': cat,
        'color': color,
        'lat': str(lat),
        'lng': str(lng),
    }
    added += 1

print(f'Added {added} new pins (some may have overwritten existing)', file=sys.stderr)
print(f'IDs overwritten by new pins: {sorted(overwritten)}', file=sys.stderr)
print(f'Total final pins: {len(pins)}', file=sys.stderr)

# ---- Format lat/lng properly ----
def fmt_coord(val):
    f = float(val)
    s = str(f)
    return s

# ---- Generate output ----
def format_pin(p):
    lat = fmt_coord(p['lat'])
    lng = fmt_coord(p['lng'])
    name = p['name'].replace('\\', '\\\\').replace('"', '\\"')
    return f'  {{id:{p["id"]},name:"{name}",emoji:"{p["emoji"]}",cat:"{p["cat"]}",color:"{p["color"]}",lat:{lat},lng:{lng}}}'

sorted_pins = sorted(pins.values(), key=lambda x: x['id'])

output_lines = []
for h in header_lines:
    output_lines.append(h)
for i, p in enumerate(sorted_pins):
    line = format_pin(p)
    if i < len(sorted_pins) - 1:
        line += ','
    output_lines.append(line)
for f_line in footer_lines:
    output_lines.append(f_line)

output = '\n'.join(output_lines)

with open('src/data/pins.js', 'w', encoding='utf-8') as f:
    f.write(output)

print(f'File written with {len(sorted_pins)} pins', file=sys.stderr)
print(f'Final sorted IDs: {[p["id"] for p in sorted_pins]}', file=sys.stderr)
