// Script de test pour l'API Chatwoot
const BASE_URL = 'https://chathub.srv837294.hstgr.cloud';
const API_TOKEN = 'MxR7hTQrpjZFsvWQGYv6TA1t';
const ACCOUNT_ID = '1';

async function testApi(endpoint, description) {
  console.log(`\n📋 ${description}`);
  console.log(`   GET ${endpoint}`);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'api_access_token': API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`   ✅ Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 500));
      if (JSON.stringify(data).length > 500) console.log('   ... (truncated)');
    } else {
      console.log(`   ❌ Status: ${response.status}`);
      console.log(`   Error:`, data);
    }

    return { success: response.ok, data, status: response.status };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('🧪 Test de l\'API Chatwoot');
  console.log('='.repeat(60));
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Account ID: ${ACCOUNT_ID}`);
  console.log(`API Token: ${API_TOKEN.substring(0, 8)}...`);

  const results = [];

  // Test 1: Profile (authentification)
  results.push(await testApi(
    '/api/v1/profile',
    'Test 1: Profil utilisateur (vérification auth)'
  ));

  // Test 2: Inboxes
  results.push(await testApi(
    `/api/v1/accounts/${ACCOUNT_ID}/inboxes`,
    'Test 2: Liste des inboxes'
  ));

  // Test 3: Agents
  results.push(await testApi(
    `/api/v1/accounts/${ACCOUNT_ID}/agents`,
    'Test 3: Liste des agents'
  ));

  // Test 4: Teams
  results.push(await testApi(
    `/api/v1/accounts/${ACCOUNT_ID}/teams`,
    'Test 4: Liste des équipes'
  ));

  // Test 5: Conversations
  results.push(await testApi(
    `/api/v1/accounts/${ACCOUNT_ID}/conversations?status=open&page=1`,
    'Test 5: Liste des conversations ouvertes'
  ));

  // Test 6: Contacts
  results.push(await testApi(
    `/api/v1/accounts/${ACCOUNT_ID}/contacts?page=1`,
    'Test 6: Liste des contacts'
  ));

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 Résumé des tests');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Réussis: ${passed}`);
  console.log(`❌ Échoués: ${failed}`);
  console.log(`Total: ${results.length}`);

  if (failed === 0) {
    console.log('\n🎉 Tous les tests sont passés ! L\'API fonctionne correctement.');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez les credentials.');
  }
}

runTests();
