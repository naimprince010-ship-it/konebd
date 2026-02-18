const BASE_URL = 'http://localhost:3000/api/profiles';

async function runTests() {
    console.log("Starting API Verification...");

    // 0. Test DB Connection
    console.log("0. Testing /api/test-db...");
    try {
        const res = await fetch('http://localhost:3000/api/test-db');
        const text = await res.text();
        console.log("Response:", text);
        if (!res.ok) throw new Error(`DB Connection Check failed: ${res.status}`);
    } catch (error) {
        console.error("❌ DB Connection failed:", error.message);
        return;
    }

    // 1. GET - Fetch initial profiles
    console.log("\n1. Testing GET /api/profiles...");
    let initialProfiles = [];
    try {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error(`GET failed: ${res.status} ${res.statusText}`);
        initialProfiles = await res.json();
        console.log(`✅ GET success. Found ${initialProfiles.length} profiles.`);
    } catch (error) {
        console.error("❌ GET failed:", error.message);
        return;
    }

    // 2. POST - Create a new profile
    console.log("\n2. Testing POST /api/profiles...");
    const newProfileData = {
        age: 25,
        height: "5'6\"",
        education: "B.Sc in CS",
        district: "Dhaka",
        image: "" // Optional
    };
    let createdProfile = null;
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfileData)
        });
        if (!res.ok) throw new Error(`POST failed: ${res.status} ${res.statusText}`);
        createdProfile = await res.json();
        if (!createdProfile.id) throw new Error("Created profile missing ID");
        console.log(`✅ POST success. Created profile with ID: ${createdProfile.id}`);
    } catch (error) {
        console.error("❌ POST failed:", error.message);
        return;
    }

    // 3. PUT - Update the profile
    console.log(`\n3. Testing PUT /api/profiles/${createdProfile.id}...`);
    const updateData = { education: "M.Sc in CS" };
    try {
        const res = await fetch(`${BASE_URL}/${createdProfile.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        if (!res.ok) throw new Error(`PUT failed: ${res.status} ${res.statusText}`);
        const updatedProfile = await res.json();
        if (updatedProfile.education !== "M.Sc in CS") throw new Error("Profile not updated correctly");
        console.log("✅ PUT success. Profile updated.");
    } catch (error) {
        console.error("❌ PUT failed:", error.message);
    }

    // 4. DELETE - Delete the profile
    console.log(`\n4. Testing DELETE /api/profiles/${createdProfile.id}...`);
    try {
        const res = await fetch(`${BASE_URL}/${createdProfile.id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`DELETE failed: ${res.status} ${res.statusText}`);
        console.log("✅ DELETE success. Profile deleted.");
    } catch (error) {
        console.error("❌ DELETE failed:", error.message);
    }

    // 5. Verify deletion
    console.log("\n5. Verifying deletion...");
    try {
        const res = await fetch(BASE_URL);
        const profiles = await res.json();
        const exists = profiles.find(p => p.id === createdProfile.id);
        if (exists) throw new Error("Profile still exists after deletion");
        console.log("✅ Verification success. Profile is gone.");
    } catch (error) {
        console.error("❌ Verification failed:", error.message);
    }
}

runTests();
