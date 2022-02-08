const registrationEmail = `
<div style="background: #f9f8f6; padding: 20px 10% 40px;">
  <div style="text-align: center">
    <img src="LOGO" id="header-logo" height="70" style="margin: auto;"/>
  </div>
  <div style="margin: 20px 0; padding: 20px 10%; border-radius: 8px; box-shadow: rgb(233 233 235 / 70%) 0px 2px 10px 5px;">
    <h1 style="text-align: center">Welcome to Art-follow!</h1>
    <p style="text-align: center">We are glad you joined Art-follow. Continue to setup your profile so other creatives can find you and get connected.</p>
    <div style="text-align: center; border-bottom: 1px solid #dedede; margin-bottom: 50px;">
      <a href="https://art-follow.com" style="text-align: center; background: #EC008C; min-width: 100px; font-size: 15px; padding: 10px 20px; font-weight: 600; display: inline-block; color: #f9f8f6; text-decoration: none; margin: 10px auto 30px; border-radius: 4px;">Visit Site</a></div>
  </div>
  <img src="LOGO" style="width: 100px; display: block; margin: 0 auto 10px;"/>
</div>
<p style="text-align: center; color: #aaa;">&copy; 2022 Art-Follow.com. All Rights Reserved.</p>
`
const verificationEmail = `
<div style="background: #f9f8f6; padding: 20px 10% 40px;">
  <div style="text-align: center">
    <img src="LOGO" id="header-logo" height="70" style="margin: auto;"/>
  </div>
  <div style="background: #f9f8f6; padding: 20px 10% 40px;">
    <div style="margin: 20px 0; padding: 20px 10%; border-radius: 8px; box-shadow: rgb(233 233 235 / 70%) 0px 2px 10px 5px;">
      <h1 style="text-align: center">Thank you for signing up</h1>
      <p style="text-align: center">Please copy and enter the code below or click Verify to verify your email.</p>
      <div style="text-align: center; border-bottom: 1px solid #dedede; margin-bottom: 50px;">
      <div>
        <h4>CODE</h4>
      </div>
      <a href="LINK?token=TOKEN" style="text-align: center; min-width: 100px; font-size: 15px; padding: 10px 20px; font-weight: 600; display: inline-block; color: #ec008c; text-decoration: none; margin: 10px auto 30px;">
        Verify
      </a>
      </div>
    </div>
  </div>
  <img src="LOGO" style="width: 100px; display: block; margin: 0 auto 10px;"/>
</div>
<p style="text-align: center; color: #aaa;">&copy; 2022 Art-Follow.com. All Rights Reserved.</p>
`

export { registrationEmail, verificationEmail }