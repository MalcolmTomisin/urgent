import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {Task} from '../../../components/Card';
import {useSelector, useDispatch} from 'react-redux';
import {instance} from '../../../api';
import {feedbackAction, accountAction} from '../../../store/actions';

const CompletedOrder = ({navigation: {isFocused}}) => {
  const {token} = useSelector(({account}) => account);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    refreshBasket();
  }, []);

  const refreshBasket = () => {
    console.log('state', isFocused());
    setRefresh(true);
    instance
      .get('rider/basket/completed', {
        headers: {
          'x-auth-token': token,
        },
      })
      .then((res) => {
        const {msg, data} = res.data;
        console.log('dat5a', data);
        setCompletedOrders(data);
        if (isFocused()) {
          dispatch(
            feedbackAction.launch({
              open: true,
              severity: 's',
              msg,
            }),
          );
        }
      })
      .catch((err) => {
        if (isFocused()) {
          dispatch(
            feedbackAction.launch({
              open: true,
              severity: 'w',
              msg: `${err}`,
            }),
          );
        }
      })
      .finally(() => setRefresh(false));
  };

  const renderTasks = () => {
    if (!completedOrders || completedOrders.length < 1) {
      return null;
    }

    return completedOrders.map((v, i) => (
      <Task
        key={i}
        pickUpAddress={v?.pickupAddress}
        deliveryAddress={v?.deliveryAddress}
        estimatedCost={v?.estimatedCost}
        id={v?.orderId}
        status={v?.entry?.status}
      />
    ));
  };

  return (
    <View style={classes.root}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshBasket} />
        }>
        {renderTasks()}
      </ScrollView>
    </View>
  );
};

export default CompletedOrder;

const classes = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-evenly',
  },
});
