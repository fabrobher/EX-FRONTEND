/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, Pressable, View } from 'react-native'

import { backward, fordward } from '../../api/OrderEndpoints'

import { getOrdersFromRestaurant } from '../../api/RestaurantEndpoints'
import ImageCard from '../../components/ImageCard'
import TextSemiBold from '../../components/TextSemibold'
import TextRegular from '../../components/TextRegular'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { AuthorizationContext } from '../../context/AuthorizationContext'
import { showMessage } from 'react-native-flash-message'

import pendingIcon from '../../../assets/timer-sand.jpg'
import inProcessIcon from '../../../assets/chef-hat.jpg'
import sentIcon from '../../../assets/truck-delivery.jpg'
import deliveredIcon from '../../../assets/food.jpg'

export default function OrdersScreen ({ navigation, route }) {
  const [orders, setOrders] = useState([])
  const { loggedInUser } = useContext(AuthorizationContext)

  useEffect(() => {
    if (loggedInUser) {
      fetchOrders()
    } else {
      setOrders(null)
    }
  }, [loggedInUser, route])

  const showPrevious = (status, reference) => {
    if (status === 'pending') {
      return false
    } else {
      const justNow = new Date(Date.now())
      const fiveMinutes = DataTransfer.parse(reference)
      return Math.abs(justNow - fiveMinutes) / 60000 <= 5
    }
  }

  const showNext = (status) => {
    return status !== 'delivered'
  }

  const getCurrentStatusDate = (item) => {
    if (item.status === 'in process') {
      return item.startedAt
    } else if (item.status === 'sent') {
      return item.sentAt
    } else if (item.status === 'delivered') {
      return item.deliveredAt
    } else {
      return null
    }
  }

  const renderOrder = ({ item }) => {
    let logo
    if (item.status === 'pending') {
      logo = pendingIcon
    } else if (item.status === 'in process') {
      logo = inProcessIcon
    } else if (item.status === 'sent') {
      logo = sentIcon
    } else {
      logo = deliveredIcon
    }

    return (

      <ImageCard
        imageUri={logo}
        title={item.status}
      >
       <TextSemiBold textStyle={{ color: GlobalStyles.brandPrimary }}>Fecha creación {item.createdAt}</TextSemiBold>
       <TextRegular>Total: {item.price}+{item.shippingCosts.toFixed(2)}€</TextRegular>
       <TextRegular>Entrega en: {item.address}</TextRegular>
       <TextRegular>Usuario: {item.user.firstName + ' ' + item.user.lastName}</TextRegular>

        <View style={styles.actionButtonsContainer}>
        { showPrevious(item.status, getCurrentStatusDate(item)) &&
          <Pressable
            onPress={() => backChangeState(item)}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandBlueTap
                  : GlobalStyles.brandBlue
              },
              styles.actionButton
            ]}>

          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='page-previous' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Previous
            </TextRegular>
          </View>
        </Pressable>
        }
         { showNext(item.status) &&
        <Pressable
            onPress={() => { nextChangeState(item) }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandPrimaryTap
                  : GlobalStyles.brandPrimary
              },
              styles.actionButton
            ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='page-next' color={'white'} size={20}/>
            <TextRegular textStyle={styles.text}>
              Next
            </TextRegular>
          </View>
         </Pressable>
        }

        </View>
      </ImageCard>
    )
  }

  const renderEmptyOrdersList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        No orders were retrieved!
      </TextRegular>
    )
  }

  const renderHeader = () => {
    return (
    <>
    </>
    )
  }

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getOrdersFromRestaurant(route.params.id)
      setOrders(fetchedOrders)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurants. ${error} `,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const backChangeState = async (item) => {
    try {
      await backward(item.id)
      const fetchedOrders = await getOrdersFromRestaurant(route.params.id)
      setOrders(fetchedOrders)
      showMessage({
        message: `Order from ${item.user.firstName} succesfully changed to previous state`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      showMessage({
        message: `Order from ${item.user.firstName} could not change to previous state`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const nextChangeState = async (item) => {
    try {
      await fordward(item.id)
      const fetchedOrders = await getOrdersFromRestaurant(route.params.id)
      setOrders(fetchedOrders)
      showMessage({
        message: `Order from ${item.user.firstName} succesfully changed to next state`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      showMessage({
        message: `Order from ${item.user.firstName} could not change the next state`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  return (
   <FlatList
      style={styles.container}
      data={orders}
      renderItem={renderOrder}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptyOrdersList}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'absolute',
    width: '90%'
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})
