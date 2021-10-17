import initApp from './app.js'
import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import crypto from 'crypto'
import http from 'http'
import m from 'mongoose'
import UserModel from './models/User.js'

const User = UserModel(m)
const app = initApp(express, bodyParser, fs, crypto, http, User, m)
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))