// Run this in browser console to check your addresses

const token = localStorage.getItem('token')

// Check if you have any addresses
fetch('https://fastapi.kevinlinportfolio.com/api/v1/addresses/', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(addresses => {
  console.log('📍 Your addresses:', addresses)
  
  if (addresses.length === 0) {
    console.log('❌ You have NO addresses!')
    console.log('🔧 You need to create an address first')
  } else {
    console.log('✅ You have', addresses.length, 'address(es)')
    console.log('First address ID:', addresses[0].id)
  }
})
.catch(err => console.error('Error checking addresses:', err))
