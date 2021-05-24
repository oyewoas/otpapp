import { v4 } from 'uuid';
import db from '../db'
import randomString from 'randomstring'
import moment from 'moment'

interface authCode {
    body: {
        userId?: string
        phone_number: string,
        auth_code?: string,
    }
}
const createAuthCode = async (req: authCode, res: any) => {
    const id = v4();
    try {
      const path = `/user/${id}`;
      const auth_code = randomString.generate({
        length: 6,
        charset: 'numeric'
      });
      const expiresAt = moment().add(120, 'seconds').format('hh:mm A');
       // Create user in the database
      db.push(path, { id, phone_number: req.body.phone_number, auth_code, expiresAt, verified: false });
      const user = db.getData(path);
      if(user){
          console.log(user.auth_code, 'Send OTP to users phone number')
      }
      // Send user id and base32 and authcode key to user
      res.json({ id, phone_number: req.body.phone_number, auth_code, expiresAt, verified: false })
    } catch(e) {
      console.log(e);
      res.status(500).json({ message: 'Error generating secret key'})
    }
  }

  const verifyAuthCode = async (req: authCode ,res: any) => {
    const { userId, phone_number, auth_code } = req.body;
    try {
      // Retrieve user from database
      const path = `/user/${userId}`;
      const user = db.getData(path);
      const { expiresAt } = user;
      const isNotExpiredCode = moment(expiresAt, 'h:mma').isAfter(moment(moment().format('hh:mm A'), 'h:mma'))
      const isCorrectCode = auth_code === user.auth_code
      const verified =  isNotExpiredCode && isCorrectCode && user.phone_number === phone_number && !user.verified
      console.log(isNotExpiredCode, expiresAt, moment().format('hh:mm A'), 'ddd')
      if(!isNotExpiredCode && isCorrectCode){
        res.json({
            message: 'Code has expired, request new code'
        })
      } else if (isNotExpiredCode && !isCorrectCode){
        res.json({
            message: 'Code is incorrect, kindly check again'
        })
      } else if (user && verified) {
        // Update user data
        db.push(path, { id: userId, phone_number: user.phone_number, verified: true });
        res.json({id: userId, phone_number: user.phone_number, verified: true, message: 'Verification Successful' })
    } else {
        res.json({ id: userId, phone_number: user.phone_number, verified: user.verified, message: 'Already Verified' })
    }
    } catch(error) {
      res.status(500).json({ message: 'Error retrieving user'})
    };
  }
  export {
      createAuthCode,
      verifyAuthCode
  }