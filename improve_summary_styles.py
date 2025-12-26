import re

file_path = r'c:\Users\KPAterne\Herd\trackingdashboard\resources\js\components\reports\templates\SummaryTemplate.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remplacer les Card avec border-2 par des versions élégantes
content = re.sub(
    r'<Card className="border-2">',
    '<Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">',
    content
)

# Améliorer les CardHeader simples
content = re.sub(
    r'<CardHeader className="pb-3">',
    '<CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">',
    content
)

# Améliorer les CardContent
content = re.sub(
    r'<CardContent>',
    '<CardContent className="bg-white">',
    content
)

# Améliorer les bg-[#D4A76A] restants
content = content.replace(
    'bg-[#D4A76A] text-white p-4 rounded-lg',
    'bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'
)

# Améliorer le sidebar Classification
content = re.sub(
    r'<Card className="bg-\[#D4A76A\] text-white sticky top-6">',
    '<Card className="bg-gradient-to-br from-[#D4A76A] to-[#C19A5B] text-white sticky top-6 shadow-xl border-0">',
    content
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Styles améliorés avec succès!")
