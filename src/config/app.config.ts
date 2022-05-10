// An example for global configuration object
export default () => ({
  // 利用箭頭函式建立一個全域物件
  environment: process.env.NODE_ENV || 'development', // 執行環境
  database: {
    // DB的設定值
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432, // 把環境變數'字串'轉成10進位'數字'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
