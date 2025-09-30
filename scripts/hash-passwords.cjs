const bcrypt = require('bcrypt');

const passwords = {
  'admin@consulting19.com': 'Admin123!',
  'giorgi.meskhi@consulting19.com': 'Consultant123!',
  'client@consulting19.com': 'Client123!'
};

async function hashPasswords() {
  console.log('-- Update password hashes for existing users');
  
  for (const [email, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`UPDATE user_profiles SET password_hash = '${hash}' WHERE email = '${email}';`);
  }
}

hashPasswords();
