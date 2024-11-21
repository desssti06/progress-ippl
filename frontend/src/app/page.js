import React from 'react'
import LandingPage from '@/app/landingpage/landingpage'
// import GuestDashboard from '@/app/guestDashboard/page'
// import landingpage from './src/app/user/landingpage/page'
// import authorAgreement from '@/app/authorAgreement/page'
import buatSoal from './author/buatSoal/page'

const page = () => {
  return (
    <div>
      <LandingPage />
      {/* <GuestDashboard /> */}
      {/* <landingpage /> */}
      <buatSoal/>
      {/* <authorAgreement /> */}
    </div>
  )
}

export default page
