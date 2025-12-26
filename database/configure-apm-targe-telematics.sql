-- ═══════════════════════════════════════════════════════════════════
-- Configuration de la connexion API TARGE TELEMATICS pour le compte APM
-- ═══════════════════════════════════════════════════════════════════
-- 
-- Ce script configure la connexion de base (URL + Token) pour la plateforme
-- TARGE TELEMATICS. Les endpoints spécifiques ont déjà été configurés via
-- le seeder ReportPlatformEndpointSeeder.
-- 
-- ═══════════════════════════════════════════════════════════════════

-- 1. Vérifier si le compte APM existe, sinon le créer
-- ─────────────────────────────────────────────────────────────────
INSERT INTO accounts (name, is_active, created_at, updated_at)
SELECT 'APM', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM accounts WHERE name = 'APM');

-- 2. Vérifier les comptes et plateformes disponibles
-- ─────────────────────────────────────────────────────────────────
SELECT 
    'Comptes disponibles:' as info;
SELECT id, name, is_active FROM accounts;

SELECT 
    'Plateformes disponibles:' as info;
SELECT id, name, slug, is_active FROM platforms;

-- 3. Configurer la connexion API pour APM sur TARGE TELEMATICS
-- ─────────────────────────────────────────────────────────────────
-- ⚠️ REMPLACEZ 'VOTRE-TOKEN-ICI' par le vrai token d'authentification

-- Vérifier si la configuration existe déjà
SELECT 
    a.name as compte,
    p.name as plateforme,
    ap.api_url,
    LEFT(ap.api_token, 20) as token_preview
FROM account_platform ap
JOIN accounts a ON ap.account_id = a.id
JOIN platforms p ON ap.platform_id = p.id
WHERE a.name = 'APM' 
  AND p.slug = 'targe-telematics';

-- Si aucune configuration n'existe, la créer :
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, http_method, token_type, created_at, updated_at)
SELECT 
    (SELECT id FROM accounts WHERE name = 'APM'),
    (SELECT id FROM platforms WHERE slug = 'targe-telematics'),
    'https://fleet.securysat.com',  -- Base URL (sans le chemin des endpoints)
    'VOTRE-TOKEN-ICI',              -- ⚠️ À REMPLACER par le vrai token
    'POST',                          -- Méthode HTTP par défaut
    'bearer',                        -- Type d'authentification
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM account_platform 
    WHERE account_id = (SELECT id FROM accounts WHERE name = 'APM')
      AND platform_id = (SELECT id FROM platforms WHERE slug = 'targe-telematics')
);

-- 4. Vérifier la configuration complète
-- ─────────────────────────────────────────────────────────────────
SELECT 
    '═══════════════════════════════════════════════════════' as verification;

SELECT 
    'Configuration API (account_platform):' as info;
    
SELECT 
    a.name as compte,
    p.name as plateforme,
    ap.api_url as base_url,
    ap.http_method,
    ap.token_type,
    LEFT(ap.api_token, 20) as token_preview,
    CASE 
        WHEN ap.api_token = 'VOTRE-TOKEN-ICI' THEN '⚠️ TOKEN À CONFIGURER'
        ELSE '✅ Token configuré'
    END as status
FROM account_platform ap
JOIN accounts a ON ap.account_id = a.id
JOIN platforms p ON ap.platform_id = p.id
WHERE a.name = 'APM' 
  AND p.slug = 'targe-telematics';

SELECT 
    'Endpoints configurés (report_platform_endpoints):' as info;

SELECT 
    rpe.order as ordre,
    rpe.http_method as methode,
    rpe.endpoint_path as chemin,
    rpe.data_key as cle_donnees,
    CASE WHEN rpe.is_required THEN 'Oui' ELSE 'Non' END as obligatoire,
    rpe.description
FROM report_platform_endpoints rpe
JOIN reports r ON rpe.report_id = r.id
JOIN platforms p ON rpe.platform_id = p.id
WHERE r.name = 'Rapport de Synthèse'
  AND p.slug = 'targe-telematics'
ORDER BY rpe.order;

-- 5. URL complètes qui seront appelées
-- ─────────────────────────────────────────────────────────────────
SELECT 
    'URLs complètes qui seront appelées:' as info;

SELECT 
    CONCAT(
        ap.api_url,
        rpe.endpoint_path
    ) as url_complete,
    rpe.http_method as methode,
    rpe.data_key as donnees
FROM report_platform_endpoints rpe
JOIN reports r ON rpe.report_id = r.id
JOIN platforms p ON rpe.platform_id = p.id
JOIN account_platform ap ON ap.platform_id = p.id
JOIN accounts a ON ap.account_id = a.id
WHERE r.name = 'Rapport de Synthèse'
  AND p.slug = 'targe-telematics'
  AND a.name = 'APM'
ORDER BY rpe.order;

-- ═══════════════════════════════════════════════════════════════════
-- Commandes suivantes
-- ═══════════════════════════════════════════════════════════════════
-- 
-- Pour tester la configuration :
--   php test-report-data-service.php
-- 
-- Pour utiliser dans votre code :
--   $service = new \App\Services\ReportDataService();
--   $result = $service->fetchReportData($report, $account, $platform, $params);
-- 
-- ═══════════════════════════════════════════════════════════════════
