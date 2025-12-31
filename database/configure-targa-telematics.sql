-- ===============================================
-- Configuration TARGA TELEMATICS
-- ===============================================
-- Script SQL pour configurer un compte avec l'accès TARGA TELEMATICS
-- Usage: Exécuter ce script après avoir créé un compte utilisateur

-- ===============================================
-- 1. CRÉER LA PLATEFORME TARGA TELEMATICS (si elle n'existe pas)
-- ===============================================

INSERT INTO platforms (name, base_api_url, logo_url, description, is_active, created_at, updated_at)
VALUES (
    'TARGA TELEMATICS',
    'https://fleet.securysat.com',
    NULL, -- Ajouter l'URL du logo si disponible
    'Plateforme TARGA TELEMATICS pour la gestion de flotte et éco-conduite',
    1, -- Actif
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    base_api_url = 'https://fleet.securysat.com',
    is_active = 1,
    updated_at = NOW();

-- ===============================================
-- 2. VÉRIFIER L'ID DE LA PLATEFORME
-- ===============================================

SELECT id, name, base_api_url 
FROM platforms 
WHERE name = 'TARGA TELEMATICS';

-- Note: Copier l'ID pour l'utiliser dans la prochaine étape

-- ===============================================
-- 3. ASSOCIER LA PLATEFORME AU COMPTE
-- ===============================================

-- IMPORTANT: Remplacer les valeurs suivantes avant d'exécuter:
-- - {ACCOUNT_ID} : L'ID du compte utilisateur
-- - {PLATFORM_ID} : L'ID de la plateforme TARGA TELEMATICS (de l'étape 2)
-- - {VOTRE_TOKEN_API} : Le token API fourni par TARGA TELEMATICS

INSERT INTO account_platform (
    account_id,
    platform_id,
    api_url,
    api_token,
    token_type,
    token_key,
    is_active,
    created_at,
    updated_at
) VALUES (
    1, -- {ACCOUNT_ID} - Remplacer par l'ID du compte
    (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS'), -- {PLATFORM_ID}
    'https://fleet.securysat.com', -- URL complète de l'API
    'VOTRE_TOKEN_API_ICI', -- {VOTRE_TOKEN_API} - Remplacer par le vrai token
    'body', -- Le token est envoyé dans le body de la requête
    'sessionId', -- Le nom du paramètre pour le token dans le body
    1, -- Actif
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE
    api_url = 'https://fleet.securysat.com',
    api_token = 'VOTRE_TOKEN_API_ICI',
    token_type = 'body',
    token_key = 'sessionId',
    is_active = 1,
    updated_at = NOW();

-- ===============================================
-- 4. VÉRIFIER LA CONFIGURATION
-- ===============================================

SELECT 
    a.id AS account_id,
    a.name AS account_name,
    p.id AS platform_id,
    p.name AS platform_name,
    ap.api_url,
    LEFT(ap.api_token, 10) AS token_preview, -- Affiche seulement les 10 premiers caractères
    ap.token_type,
    ap.token_key,
    ap.is_active,
    ap.created_at
FROM account_platform ap
INNER JOIN accounts a ON ap.account_id = a.id
INNER JOIN platforms p ON ap.platform_id = p.id
WHERE p.name = 'TARGA TELEMATICS'
ORDER BY a.id;

-- ===============================================
-- 5. TESTER LA CONFIGURATION (Optionnel)
-- ===============================================

-- Après avoir exécuté les étapes ci-dessus, tester avec :
-- php test-eco-driving-service.php

-- Ou via l'API :
-- GET /api/eco-driving

-- ===============================================
-- EXEMPLES DE CONFIGURATIONS MULTIPLES
-- ===============================================

-- Pour configurer plusieurs comptes en une fois:

INSERT INTO account_platform (account_id, platform_id, api_url, api_token, token_type, token_key, is_active, created_at, updated_at)
VALUES
    -- Compte 1
    (1, (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS'), 'https://fleet.securysat.com', 'TOKEN_COMPTE_1', 'body', 'sessionId', 1, NOW(), NOW()),
    -- Compte 2
    (2, (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS'), 'https://fleet.securysat.com', 'TOKEN_COMPTE_2', 'body', 'sessionId', 1, NOW(), NOW()),
    -- Compte 3
    (3, (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS'), 'https://fleet.securysat.com', 'TOKEN_COMPTE_3', 'body', 'sessionId', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE
    api_url = VALUES(api_url),
    api_token = VALUES(api_token),
    is_active = VALUES(is_active),
    updated_at = NOW();

-- ===============================================
-- GESTION DES TOKENS
-- ===============================================

-- Mettre à jour un token existant
UPDATE account_platform
SET api_token = 'NOUVEAU_TOKEN',
    updated_at = NOW()
WHERE account_id = 1
  AND platform_id = (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS');

-- Désactiver l'accès TARGA pour un compte
UPDATE account_platform
SET is_active = 0,
    updated_at = NOW()
WHERE account_id = 1
  AND platform_id = (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS');

-- Réactiver l'accès
UPDATE account_platform
SET is_active = 1,
    updated_at = NOW()
WHERE account_id = 1
  AND platform_id = (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS');

-- ===============================================
-- REQUÊTES UTILES POUR LE DÉBOGAGE
-- ===============================================

-- Lister tous les comptes avec TARGA TELEMATICS
SELECT 
    a.id,
    a.name,
    ap.api_url,
    ap.is_active,
    ap.updated_at
FROM accounts a
INNER JOIN account_platform ap ON a.id = ap.account_id
INNER JOIN platforms p ON ap.platform_id = p.id
WHERE p.name = 'TARGA TELEMATICS';

-- Vérifier les tokens expirés (si vous stockez une date d'expiration)
-- Note: Adapter selon votre schéma
SELECT 
    a.name,
    ap.api_token,
    ap.updated_at
FROM account_platform ap
INNER JOIN accounts a ON ap.account_id = a.id
INNER JOIN platforms p ON ap.platform_id = p.id
WHERE p.name = 'TARGA TELEMATICS'
  AND ap.updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY); -- Tokens non mis à jour depuis 90 jours

-- Compter les comptes actifs par plateforme
SELECT 
    p.name AS platform,
    COUNT(*) AS active_accounts
FROM account_platform ap
INNER JOIN platforms p ON ap.platform_id = p.id
WHERE ap.is_active = 1
GROUP BY p.name
ORDER BY active_accounts DESC;

-- ===============================================
-- NETTOYAGE (À UTILISER AVEC PRÉCAUTION)
-- ===============================================

-- Supprimer la configuration TARGA pour un compte spécifique
-- ATTENTION: Cette action est irréversible
-- DELETE FROM account_platform
-- WHERE account_id = 1
--   AND platform_id = (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS');

-- Supprimer complètement la plateforme TARGA TELEMATICS
-- ATTENTION: Supprimera TOUTES les configurations pour TOUS les comptes
-- DELETE FROM account_platform 
-- WHERE platform_id = (SELECT id FROM platforms WHERE name = 'TARGA TELEMATICS');
-- DELETE FROM platforms WHERE name = 'TARGA TELEMATICS';

-- ===============================================
-- NOTES IMPORTANTES
-- ===============================================

/*
1. TOKEN DE SÉCURITÉ
   - Ne jamais commit le token dans le code source
   - Le token doit être stocké uniquement dans la base de données
   - Utiliser des variables d'environnement pour les tokens de test

2. STRUCTURE DE LA TABLE account_platform
   La table doit avoir au minimum les colonnes suivantes:
   - account_id (FK vers accounts)
   - platform_id (FK vers platforms)
   - api_url (URL de base de l'API)
   - api_token (Token d'authentification)
   - token_type ('bearer', 'header', 'body')
   - token_key (Nom du paramètre pour le token)
   - is_active (0 ou 1)
   - created_at, updated_at

3. FORMAT DU TOKEN
   Le format exact du token dépend de votre fournisseur TARGA TELEMATICS.
   Exemple: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

4. ENDPOINTS DISPONIBLES
   Avec cette configuration, vous aurez accès à:
   - /json/getDailyVehicleEcoSummary (utilisé pour eco-driving)
   - /json/getEventHistoryReport (événements)
   - /json/getStopReport (arrêts)
   
   Pour ajouter d'autres endpoints, suivre la documentation dans:
   PARAMETERS_UPDATE.md

5. TEST APRÈS CONFIGURATION
   Après avoir configuré la plateforme, exécuter:
   
   ```bash
   php test-eco-driving-service.php
   ```
   
   Cela vérifiera:
   - La connexion à l'API TARGA TELEMATICS
   - La validité du token
   - Le bon fonctionnement de la transformation des données

6. CACHE
   Les données sont mises en cache pendant 5 minutes.
   Pour vider le cache:
   
   ```bash
   php artisan cache:clear
   ```

7. LOGS
   En cas de problème, consulter les logs:
   
   ```bash
   tail -f storage/logs/laravel.log | grep "TARGA"
   ```
*/

-- ===============================================
-- FIN DU SCRIPT
-- ===============================================
