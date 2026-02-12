
import { type Cookie } from 'tough-cookie';

const BASE_URL = 'http://localhost:3000';
const ADMIN_PASSWORD = 'bhaskar_admin_2024';

async function testUploadFlow() {
    console.log('1. Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/api/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });

    if (!loginRes.ok) {
        console.error('Login Failed:', await loginRes.text());
        return;
    }

    const cookieHeader = loginRes.headers.get('set-cookie');
    if (!cookieHeader) {
        console.error('Login succeeded but no cookie returned.');
        return;
    }

    // Simple extraction of the admin_session cookie value
    const sessionMatch = cookieHeader.match(/admin_session=([^;]+)/);
    const sessionValue = sessionMatch ? sessionMatch[1] : null;

    if (!sessionValue) {
        console.error('Could not extract admin_session from cookie header:', cookieHeader);
        return;
    }

    console.log('Login Successful. verified Cookie.');

    console.log('2. Testing Upload...');
    const formData = new FormData();
    // Create a dummy file blob
    const fileContent = "Hello World Verification";
    const file = new Blob([fileContent], { type: 'text/plain' });
    formData.append('file', file, 'verify_upload.txt');
    // formData.append('path', 'resumes/verify_upload.txt'); // Not needed for local storage API

    const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
            'Cookie': `admin_session=${sessionValue}`
        },
        body: formData,
    });

    const text = await uploadRes.text();
    console.log('Upload Status:', uploadRes.status);
    console.log('Upload Response:', text);

    if (uploadRes.ok) {
        console.log("VERIFICATION SUCCESSFUL: functionality is working.");
    } else {
        console.log("VERIFICATION FAILED: functionality is broken.");
        console.log("Error details:", text);
    }
}

testUploadFlow().catch((err) => {
    console.error("Script failed with error:", err);
});
