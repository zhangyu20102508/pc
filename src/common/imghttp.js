let imghttp = null

if (process.env.NODE_ENV === 'qa') {
  imghttp = 'https://imgtest.nuskin.com.tw'
} else if (process.env.NODE_ENV === 'stage') {
  imghttp = 'https://imgstage.nuskin.com.tw'
} else if (process.env.NODE_ENV === 'production') {
  imghttp = 'https://img.nuskin.com.tw'
} else if (process.env.NODE_ENV === 'prod') {
  imghttp = 'https://img.nuskin.com.tw'
}

export default imghttp
