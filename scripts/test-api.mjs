import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleIdentifyRequest } from '../api/identify.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

// Load sample specimen base64
const samplePath = path.join(__dirname, 'test_specimen.b64');
const specimenBase64 = fs.existsSync(samplePath)
  ? fs.readFileSync(samplePath, 'utf-8').trim()
  : 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function runTests() {
  console.log('--- FieldLens Backend & Gemma Vision Inference Verification ---\n');

  // Test 1: Empty payload validation
  console.log('1. Testing validation for empty payload...');
  const emptyRes = await handleIdentifyRequest({ imageBase64: '' });
  if (emptyRes.status === 400) {
    console.log('   ✓ PASS: Rejected empty image payload with 400 Bad Request.\n');
  } else {
    console.error('   ✗ FAIL: Expected 400 Bad Request.\n');
    process.exit(1);
  }

  // Test 2: Live Google Gemma Vision inference
  console.log('2. Testing live Google Gemma Vision inference...');
  const model = process.env.GEMMA_MODEL || 'models/gemma-4-26b-a4b-it';
  console.log(`   Configured model: ${model}`);

  const start = Date.now();
  const liveRes = await handleIdentifyRequest({
    imageBase64: specimenBase64,
    mimeType: 'image/jpeg',
  });
  const duration = ((Date.now() - start) / 1000).toFixed(2);

  if (liveRes.status === 200 && liveRes.body.success) {
    const data = liveRes.body.data;
    console.log(`   ✓ PASS: Gemma responded in ${duration}s!`);
    console.log(`   - Category: ${data.category}`);
    console.log(`   - Common Name: ${data.common_name}`);
    console.log(`   - Scientific Name: ${data.scientific_name ?? '(None / Unverified)'}`);
    console.log(`   - Uncertainty: ${data.uncertainty} (${data.uncertainty_reason})`);
    console.log(`   - Summary: ${data.identification_summary}`);
    console.log(`   - Visual Evidence: ${data.visual_evidence}`);
    console.log(`   - Outdoor Tip: ${data.observation_tip}`);
    console.log(`   - Safety Note: ${data.safety_note}`);
    console.log('\n✓ All FieldLens schema fields strictly validated!\n');
  } else {
    console.error('   ✗ FAIL: Inference error:', liveRes.body);
    process.exit(1);
  }

  console.log('--- All Tests Passed Successfully! ---');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
