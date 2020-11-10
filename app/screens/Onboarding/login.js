import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Title, Subheading} from 'react-native-paper';
import {Button} from '../../components/Button';
import img from '../../image';
import {colors} from '../../theme';
import {TextField} from '../../components/TextField';
import BackButton from '../../navigation/custom/BackButton';
import {useSelector, useDispatch} from 'react-redux';
import {setSignInToken} from '../../store/actions/signUp';
import {validateEmail} from '../../utils';
import {api} from '../../api';
import feedbackAction from '../../store/actions/feedback';
import {FeedBack} from '../../components/Feedback';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation: {goBack, navigate}}) => {
  const dispatch = useDispatch();
  const {signedIn} = useSelector(({signup}) => signup);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({mobileNumber: '', password: ''});
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (type, input) => {
    if (type === 1) {
      setError({...error, mobileNumber: null});
      setMobileNumber(input);
    }
    if (type === 2) {
      setError({...error, password: null});
      setPassword(input);
    }
  };

  const handleErrors = (type) => {
    if (type === 1) {
      if (!validateEmail(mobileNumber) && mobileNumber.length !== 11) {
        setError({...error, mobileNumber: 'Invalid input'});
      }
    }
    if (type === 2) {
      if (password.length < 6) {
        setError({
          ...error,
          password: 'Password must be at least 6 characters',
        });
      }
    }
  };

  const submit = () => {
    if (!error.mobileNumber && !error.password) {
      fetch(api.login, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({email: mobileNumber, password}),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          throw new Error('Unsuccessful');
        })
        .then((res) => {
          dispatch(
            feedbackAction.launch({open: true, severity: 's', msg: res.msg}),
          );
          AsyncStorage.setItem(api.userAuthKey, JSON.stringify(true));
          dispatch(setSignInToken({signedIn: true}));
          navigate('Dashboard', {screen: 'Home'});
        })
        .catch((err) => {
          dispatch(
            feedbackAction.launch({open: true, severity: 'w', msg: 'Error'}),
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <ScrollView>
      <View style={classes.root}>
        <View style={classes.headerRoot}>
          <BackButton goBack={() => goBack()} />
        </View>
        <View style={classes.bodyRoot}>
          <Title style={classes.bodyTitle}>Login</Title>
          <TextField
            label="Mobile Number"
            value={mobileNumber}
            placeholder="+234"
            placeholderTextColor="grey"
          />
          <TextField
            label="Password"
            value={password}
            secureTextEntry
            placeholder="Enter password"
            placeholderTextColor="grey"
          />
          <Button label="Sign In" />
        </View>
        <View style={classes.footerRoot}>
          <View style={{flexGrow: 1}} />
          <View style={classes.signupRoot}>
            <Subheading style={classes.signupLeft}>
              Don't Have An Account Yet?
              <TouchableOpacity onPress={() => navigate('Register')}>
                <Subheading style={classes.signupRight}> Sign Up.</Subheading>
              </TouchableOpacity>
            </Subheading>
          </View>
        </View>
      </View>
      <FeedBack />
    </ScrollView>
  );
};

export default Login;

const classes = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bodyRoot: {
    flex: 4,
    marginHorizontal: 20,
    justifyContent: 'space-evenly',
  },
  bodyTitle: {
    fontSize: 28,
  },
  footerRoot: {
    // borderTopColor: colors.hr,
    // borderTopWidth: 1,
    flex: 4,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  hr: {
    borderBottomColor: colors.hr.light,
    borderBottomWidth: 1,
    height: 10,
  },
  signupRoot: {
    height: 120,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopColor: colors.hr.light,
    borderTopWidth: 1,
    width: '100%',
    paddingVertical: 20,
  },
  signupRight: {
    color: colors.red.main,
  },
  signupLeft: {
    color: colors.grey.main,
  },
});
