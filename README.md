# imagemaker.js (Ephoto360 API)
A module for Download of Image Makers from Ephoto360

Importing the Module (TS)
```ts
import { Maker } from 'imagemaker.js'
```
Importing the Module (JS)
```ts
const { Maker } = require('imagemaker.js')
```
Get Ephoto360 URL Maker
```ts
const maker = new Maker()
const res = await maker.Ephoto360('https://en.ephoto360.com/create-colorful-angel-wing-avatars-731.html', ["Bruno Mars"])
console.log(res)
```
Response: 
```
{
  success: boolean;
  imageUrl: string;
  session_id: number
}
```
