# [112-1] Web Programming Final

## (Group 15) Capture Your Music!

- 這個服務在做什麼：Capture Your Music! 是一個音樂評分/評論平台，靈感來自於影評平台 LetterBoxd。透過 Capture Your Music!，用戶可以發布他們喜愛的音樂作品，同時對其他用戶上傳的音樂進行評分與評論，進一步促進音樂愛好者之間的交流與分享。
- Demo 影片連結：
- Deployed 連結：
- 使用與參考之框架/模組/原始碼
   - Frontend & Backend: Next.js
   - Database: Neon
- 使用之第三方套件、框架、程式碼
   - 本課程的 hack2、hw3
   - Next Auth、Toast、Drizzle-ORM、Material-UI、Tailwind CSS

## 功能說明

1. 身分驗證與個人頁面
   1. 登入/註冊
      - 若目前使用者未登入/註冊，點選畫面右上角的按鈕 `Sign In/Up` 進行登入/註冊
         - 此功能參考課程教學內容，Password 在存入資料庫之前，會先 hash，非明碼存入
         - 註冊時，Email 與 Name 不得與資料庫內容重複，且密碼應至少 8 位字元
      - 若不想繼續登入/註冊，點選按鈕 `Cancel` 回到主頁面

   2. 登出
      - 使用者登入後，可點選畫面右上角的按鈕 `Sign Out` 登出，並回到主頁面

   3. 個人頁面
      - 使用者登入後，可點選畫面右上角的按鈕 `Username's Account`，進入個人頁面
      - 個人頁面中，可看到該使用者的個人資訊、上傳過的歌曲、評分過的歌曲
      - 點選 Profile Information 旁的按鈕 `Edit Bio` 編輯個人自我介紹，自我介紹不能超過 500 字元
      - 點選各歌曲可進入該歌曲頁面，詳見第 3 小節

2. 主頁面
   1. 歌曲資訊
      - 無論是否登入，都能瀏覽所有歌曲，並看到各歌曲的歌手、歌名、平均評分、評分人數的資訊
   2. 發布歌曲
      - 登入後，可點選畫面右上角的按鈕 `Post!` 發布新的歌曲
         - 請在 `Song Title` 填入一首歌曲的名稱，並注意名稱不應超過 50 字元
         - 請在 `Singer` 填入一位歌手的名稱，並注意名稱不應超過 50 字元
         - 請在 `Song Link` 填入一首歌曲的連結，並注意連結不應超過 300 字元
         - 請在 `Song Thumbnail` 填入一張圖片的連結，並注意連結不應超過 300 字元
   3. 點選各歌曲可進入該歌曲頁面，詳見第 3 小節
   4. 搜尋
      - 填入欲搜尋的歌曲名稱，並按下按鈕 `Capture!`，也可以透過按下 `Enter` 達成。
      - 若結束搜尋，請將搜尋欄的內容清空，並再次按下按鈕`Capture!` 或者按下 `Enter`，即可重新看到所有歌曲
   5. 排序
      - 可依照日期（Descending/Ascending date）或歌曲平均評分（Descending/Ascending rating）對歌曲進行排序

3. 歌曲頁面
   1. 歌曲資訊
      - 顯示歌曲名稱、歌手名稱、thumbnail、綜合評分、評分人數、上傳的使用者、評論等
      - 點選 `Click to Listen` 可連結至外部網站並播放該歌曲
   2. 評分
      - 登入後，可以點選星星對歌曲評分
         - 若欲修改評分，重新點選星星即可
   3. 評論
      - 登入後，可以在 `Comment!` 留言框輸入評論，按下留言框右方的按鈕 `Send!` 或者按下 `Enter` 發布評論
      - 登入後，可以點選每一則評論的右方按鈕，like 或 dislike 該評論
         - 若欲修改 like 或 dislike，重新點選按鈕即可
         - 如原本對該留言有進行 like 或 dislike ，如果按了和原本的相反則原本的將自動取消
      - 排序
         - 無論是否登入，都可以依照評論時間（Latest/Oldest on top）、評論者給予該歌曲的評分（Highest/Lowest Rating on top）、評論得到的 like 或 dislike 數量（Most Liked/Hated on top）對評論進行排序
   4. 返回
      - 按下左上角箭頭即可返回主頁面

## Running the app in localhost

1. Install dependencies

   ```bash
   yarn
   ```

2. Get Github OAuth credentials
   - Go to `Settings` tab of your Github account
   - Click `Developer settings` on the left sidebar
   - Click `OAuth Apps` on the left sidebar
   - Click `New OAuth App` or `Registr a new application`
   - Enter the following information:
     - `Application name`: `Music!` (or any name you like)
     - `Homepage URL`: `http://localhost:3000`
     - `Authorization callback URL`: `http://localhost:3000/api/auth/callback/github`
   - Click `Register application`
   - Copy the `Client ID` and `Client Secret` to your `.env.local` file (see the next step):
     - Before copying the Clinet Secret, you may need to click on `Generate a new client secret` first

3. Create a `.env.local` file in the root of the project by copying the `.env.example` file. Then, add the following content:

   ```bash
   POSTGRES_URL=postgres://postgres:postgres@localhost:5432/final

   AUTH_SECRET=<ANY_RANDOM_STRING>
   AUTH_GITHUB_ID=<Client ID>
   AUTH_GITHUB_SECRET=<Client Secret>

   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Start the database
   ```bash
   docker compose up -d
   ```

5. Run migrations
   ```bash
   yarn migrate
   ```

6. Start the development server
   ```bash
   yarn dev
   ```

7. Open http://localhost:3000 in your browser

## 每位組員之負責項目

- B10705022 資管三 謝宛軒
   - 主要負責身分驗證與個人頁面的前端
- B10902075 資工三 王德意
   - 主要負責主頁面與歌曲頁面的前端
- B10902125 資工三 陳竹筠
   - 主要負責後端，包含 database、hooks、api 等

## 專題製作心得

- B10705022 資管三 謝宛軒
   - 心得
- B10902075 資工三 王德意
   - 心得
      ```
      這應該是我第一次與他人一起實作一個共同的project，先前作的幾個project都是自己弄出來的，導致我其實不太使用github去維護一個專案的版本，也就導致開頭常因為git指令的不熟悉感到沮喪。在這次的作業中，我負責前端歌曲有關的功能，常常跟後端對不好資料而導致進度遲緩，但後來這種情況在專案有一個雛型之後大幅改善了!
      在這次作業完成後，我明白了在一個團隊中協作的重要性，github指令的使用上也更加得心應手，這真是一個難得的體驗。
      ```
- B10902125 資工三 陳竹筠
   - 心得  
     
      ```
      第一次參與一個真正名義上的 project，而這次我負責處理後端。我覺得整個過程一開始是最困難的，因為前端和後端其實有一點互相卡住對方。因為前端會需要後端傳資料，但是後端並不清楚前端需要什麼，所以會一直發生互相等彼此寫完的過程。因此，我們透過共同編輯一個文件，並定義好前端需求的格式，由前端發出需求，後端透過需求寫好功能工前端使用，這樣子前端可以不用擔心命名和後端有差而無法進行工作。這個過稱中，也很感謝自己的隊友，因為我看到網站有某一個部分可以加強，或者想要加上新功能都會直接提出，隊友們也會及時進行討論並將其前端所需要的介面完成。
      ```
