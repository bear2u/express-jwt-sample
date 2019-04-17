import localStrategy from './localStrategy'
import jwtStrategy from './jwtStrategy'

module.exports = (passport) => {
    localStrategy(passport),
    jwtStrategy(passport)
}