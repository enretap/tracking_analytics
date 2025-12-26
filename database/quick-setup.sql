-- ============================================================
-- Script de Configuration Rapide - Service de Véhicules
-- ============================================================
-- Ce script configure rapidement les plateformes et les lie
-- au premier compte avec les APIs mock pour les tests
-- ============================================================

-- 1. Créer les plateformes si elles n'existent pas
-- ============================================================

INSERT INTO platforms (name, slug, provider, is_active, created_at, updated_at)
SELECT 'GPS Tracker Pro', 'gps-tracker', 'GPS Tracker Inc.', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM platforms WHERE slug = 'gps-tracker');

INSERT INTO platforms (name, slug, provider, is_active, created_at, updated_at)
SELECT 'Fleet Manager', 'fleet-manager', 'Fleet Solutions Ltd.', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM platforms WHERE slug = 'fleet-manager');

INSERT INTO platforms (name, slug, provider, is_active, created_at, updated_at)
SELECT 'Track Pro', 'track-pro', 'Track Pro Systems', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM platforms WHERE slug = 'track-pro');

-- 2. Vérifier que nous avons au moins un compte
-- ============================================================

DO $$
DECLARE
    account_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO account_count FROM accounts;
    
    IF account_count = 0 THEN
        RAISE EXCEPTION 'Aucun compte trouvé. Veuillez créer un compte d''abord.';
    END IF;
END $$;

-- 3. Lier les plateformes au premier compte avec les APIs mock
-- ============================================================

-- GPS Tracker
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
SELECT 
    (SELECT id FROM accounts ORDER BY id LIMIT 1),
    (SELECT id FROM platforms WHERE slug = 'gps-tracker'),
    'http://localhost/mock-api/gps-tracker/vehicles',
    'test-token-gps-tracker-123',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM account_platform 
    WHERE account_id = (SELECT id FROM accounts ORDER BY id LIMIT 1)
    AND platform_id = (SELECT id FROM platforms WHERE slug = 'gps-tracker')
);

-- Fleet Manager
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
SELECT 
    (SELECT id FROM accounts ORDER BY id LIMIT 1),
    (SELECT id FROM platforms WHERE slug = 'fleet-manager'),
    'http://localhost/mock-api/fleet-manager/vehicles',
    'test-token-fleet-manager-456',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM account_platform 
    WHERE account_id = (SELECT id FROM accounts ORDER BY id LIMIT 1)
    AND platform_id = (SELECT id FROM platforms WHERE slug = 'fleet-manager')
);

-- Track Pro
INSERT INTO account_platform (account_id, platform_id, api_url, api_token, created_at, updated_at)
SELECT 
    (SELECT id FROM accounts ORDER BY id LIMIT 1),
    (SELECT id FROM platforms WHERE slug = 'track-pro'),
    'http://localhost/mock-api/track-pro/units',
    'test-token-track-pro-789',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM account_platform 
    WHERE account_id = (SELECT id FROM accounts ORDER BY id LIMIT 1)
    AND platform_id = (SELECT id FROM platforms WHERE slug = 'track-pro')
);

-- 4. Vérifier la configuration
-- ============================================================

SELECT 
    a.id as account_id,
    a.name as account_name,
    p.name as platform_name,
    p.slug as platform_slug,
    ap.api_url,
    'Configured' as status
FROM account_platform ap
JOIN accounts a ON ap.account_id = a.id
JOIN platforms p ON ap.platform_id = p.id
WHERE a.id = (SELECT id FROM accounts ORDER BY id LIMIT 1)
ORDER BY p.slug;

-- ============================================================
-- Configuration terminée !
-- 
-- Prochaines étapes :
-- 1. Accédez à votre application web
-- 2. Connectez-vous avec un utilisateur lié au compte configuré
-- 3. Visitez /vehicles ou /dashboard
-- 4. Les véhicules des APIs mock devraient s'afficher
-- 
-- Pour passer en production :
-- 1. Remplacez les api_url par les vraies URLs
-- 2. Remplacez les api_token par les vrais tokens
-- 3. Supprimez les routes mock de routes/web.php
-- ============================================================
