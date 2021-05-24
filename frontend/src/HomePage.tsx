import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import './HomePage.css'
import axios from 'axios'

const baseUrl = 'http://localhost:9000/api/v1'
interface IData {
    auth_code?: string
    id?: string
    phone_number?: string
    verified?: boolean
    message?: string
}
const HomePage = () => {
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined)
    const [data, setData] = useState<IData | undefined>(undefined)
    const [verifyOtp, setVerifyOtp] = useState(false)
    useEffect(() => {
        const fetch = async () => {
            const res = await axios.get('http://localhost:9000/api/v1')
            console.log(res)

        }
        fetch()

    }, [])
    const handlePhoneChange = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setPhoneNumber(e.target.value)
        }
    }

    const handleOtpChange = async (name: string, e: ChangeEvent<HTMLInputElement>)  => {
        e.preventDefault()
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setData({ ...data, [name]: e.target.value })
        }
    }

    const handleGenerateCode = useCallback(async () => {
        try{
        if (phoneNumber) {
            const response = await axios.post(`${baseUrl}/createAuthCode`, {
                phone_number: phoneNumber
            })
            if (response.data) {
                setData(response.data)
            }
        }
        setPhoneNumber(undefined)
    } catch(e){
        setData({ ...data, message: 'An error occured, check if credentials is valid' })
    }
    }, [phoneNumber, data])
    const handleVerifyCode = useCallback(async () => {
        try{
            if (data) {
                const response = await axios.post(`${baseUrl}/verifyAuthCode`, {
                    userId: data.id,
                    phone_number: data.phone_number,
                    auth_code: data.auth_code
                })
                if (response.data) {
                    setData(response.data)
                }
            }
            setVerifyOtp(false)
        } catch(e){
            setData({ ...data, message: 'An error occured, check if credentials is valid' })
        }
        
    }, [data])
    const toggleVerifyOtp = () => {
        setVerifyOtp(!verifyOtp)
    }
    console.log(phoneNumber, data, 'ohone')
    return (
        <div className='homepage-container'>
            <div className='form'>
                {data?.verified === false || verifyOtp ? <input onChange={(e) => handleOtpChange('auth_code', e)} value={data?.auth_code || ''} className='form-input' type='text' placeholder='Input OTP Number' /> : <input onChange={handlePhoneChange} value={phoneNumber || ''} className='form-input' type='text' placeholder='Input Phone Number' />}
                {data?.verified === false || verifyOtp ? <input onChange={(e) => handleOtpChange('phone_number', e)} value={data?.phone_number || ''} className='form-input' type='text' placeholder='Input Phone Number' />: null}
                <span className='message'>{data?.message ? data.message : ''}</span>
                {data?.auth_code ? <p className='message'>OTP Sent: {data.auth_code}</p> : null}

                {data?.verified === false || verifyOtp ? <button onClick={handleVerifyCode} className='form-button' disabled={!data?.auth_code}>Verify</button>: <button onClick={handleGenerateCode} className='form-button' disabled={phoneNumber === undefined}>Generate Code</button>}
            </div>

           <button onClick={toggleVerifyOtp} className='otp-button'>Verify Otp</button>
        </div>
    )
}

export default HomePage