-- Configuration de l'identifiant compte CTRACK
-- Ce script permet de configurer l'identifiant externe du compte CTRACK

-- ==============================================
-- ÉTAPE 1: Exécuter la migration
-- ==============================================
-- php artisan migrate

-- ==============================================
-- ÉTAPE 2: Vérifier la configuration actuelle
-- ==============================================
SELECT 
    a.id as account_id,
    a.name as account_name,
    p.name as platform_name,
    ap.api_url,
    ap.external_account_id,
    CASE 
        WHEN ap.external_account_id IS NOT NULL THEN '✅ Configuré'
        ELSE '⚠️ Non configuré'
    END as status
FROM accounts a
JOIN account_platform ap ON a.id = ap.account_id
JOIN platforms p ON ap.platform_id = p.id
WHERE p.slug = 'ctrack' OR p.name LIKE '%CTRACK%';

-- ==============================================
-- ÉTAPE 3: Configurer l'identifiant CTRACK
-- ==============================================

-- Option A: Configurer pour un compte spécifique par nom
UPDATE account_platform ap
JOIN accounts a ON ap.account_id = a.id
JOIN platforms p ON ap.platform_id = p.id
SET ap.external_account_id = 'VOTRE_ID_COMPTE_CTRACK'  -- ⚠️ MODIFIER ICI
WHERE a.name = 'NOM_DU_COMPTE'                          -- ⚠️ MODIFIER ICI
  AND (p.slug = 'ctrack' OR p.name LIKE '%CTRACK%');

-- Option B: Configurer pour un compte spécifique par ID
UPDATE account_platform ap
JOIN platforms p ON ap.platform_id = p.id
SET ap.external_account_id = 'VOTRE_ID_COMPTE_CTRACK'  -- ⚠️ MODIFIER ICI
WHERE ap.account_id = 1                                 -- ⚠️ MODIFIER ICI (ID du compte)
  AND (p.slug = 'ctrack' OR p.name LIKE '%CTRACK%');

-- ==============================================
-- ÉTAPE 4: Vérifier la configuration
-- ==============================================
SELECT 
    a.id,
    a.name as account,
    p.name as platform,
    ap.api_url,
    ap.external_account_id,
    CONCAT('https://', ap.api_url, '/api/units/ecoDriving?accountId=', ap.external_account_id) as endpoint_avec_filtre
FROM accounts a
JOIN account_platform ap ON a.id = ap.account_id
JOIN platforms p ON ap.platform_id = p.id
WHERE p.slug = 'ctrack' OR p.name LIKE '%CTRACK%';

-- ==============================================
-- ÉTAPE 5: Supprimer l'identifiant (si nécessaire)
-- ==============================================
-- UPDATE account_platform ap
-- JOIN platforms p ON ap.platform_id = p.id
-- SET ap.external_account_id = NULL
-- WHERE ap.account_id = 1
--   AND (p.slug = 'ctrack' OR p.name LIKE '%CTRACK%');

-- ==============================================
-- EXEMPLES D'UTILISATION
-- ==============================================

-- Configurer plusieurs comptes en une seule fois
-- UPDATE account_platform ap
-- JOIN accounts a ON ap.account_id = a.id
-- JOIN platforms p ON ap.platform_id = p.id
-- SET ap.external_account_id = CASE
--     WHEN a.name = 'Compte 1' THEN 'CLIENT_001'
--     WHEN a.name = 'Compte 2' THEN 'CLIENT_002'
--     WHEN a.name = 'Compte 3' THEN 'CLIENT_003'
--     ELSE ap.external_account_id
-- END
-- WHERE (p.slug = 'ctrack' OR p.name LIKE '%CTRACK%')
--   AND a.name IN ('Compte 1', 'Compte 2', 'Compte 3');

-- ==============================================
-- DIAGNOSTIC
-- ==============================================

-- Comptes sans identifiant CTRACK configuré
SELECT 
    a.id,
    a.name as account_name,
    '⚠️ Identifiant CTRACK manquant' as warning
FROM accounts a
JOIN account_platform ap ON a.id = ap.account_id
JOIN platforms p ON ap.platform_id = p.id
WHERE (p.slug = 'ctrack' OR p.name LIKE '%CTRACK%')
  AND ap.external_account_id IS NULL;

-- Comptes avec identifiant CTRACK configuré
SELECT 
    a.id,
    a.name as account_name,
    ap.external_account_id as ctrack_id,
    '✅ Configuration OK' as status
FROM accounts a
JOIN account_platform ap ON a.id = ap.account_id
JOIN platforms p ON ap.platform_id = p.id
WHERE (p.slug = 'ctrack' OR p.name LIKE '%CTRACK%')
  AND ap.external_account_id IS NOT NULL;
