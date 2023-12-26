# [112-1] Web Programming Final

- (Group 15) Music!
- Demo 影片連結
- 描述這個服務在做什麼
- Deployed 連結
- 使用/操作方式 (含伺服器端以及使用者端)
- 其他說明
- 使用與參考之框架/模組/原始碼
- 使用之第三方套件、框架、程式碼
- 專題製作心得

## 功能說明

1. 登入/註冊：  
   若目前使用者未登入/註冊，點選畫面右上角的按鈕 **`Sign In/Up`** 登入/註冊。  
   此功能參考課程教學內容，Password 在存入資料庫之前，會先 hash，非明碼存入。  
   惟須注意註冊時，Email 與 Name 不得與資料庫內容重複。  
   若登入/註冊失敗，會 alert 錯誤訊息。  
   若不想登入/註冊，點選按鈕 **`Cancel`** 回到主頁面。

2. 登出：  
   使用者登入後，可點選畫面右上角的按鈕 **`Sign Out`** 登出，並回到主頁面。

3. 個人頁面：  
   使用者登入後，可點選畫面右上角的 username，進入個人頁面。  
   個人頁面中，可看到該使用者的個人資訊、上傳過的歌曲、評分過的歌曲。  
   點選歌曲資訊可進入該歌曲頁面。  
   若欲回到主頁面，可點選畫面左上角的左箭頭或 Music!。

## Running the app in localhost

1. Clone the repo

2. Install dependencies

```bash
yarn
```

3. Create a `.env.local` file in the root of the project and add the following content:

```bash
POSTGRES_URL=postgres://postgres:postgres@localhost:5432/final

AUTH_SECRET=<ANY_RANDOM_STRING>
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

5. Start the database
   ```bash
   docker compose up -d
   ```

6. Run migrations
   ```bash
   yarn migrate
   ```

7. Start the development server
   ```bash
   yarn dev
   ```

8. Open http://localhost:3000 in your browser

## 每位組員之負責項目
