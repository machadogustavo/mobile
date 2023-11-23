import React from "react"
import { useState, useEffect } from "react"
import { Text, View, TouchableOpacity, Modal } from "react-native"
import Svg, { Path } from "react-native-svg"
import { styles } from "../../styles"

const Header = ({ setModal }) => {
  const [greeting, setGreeting] = useState("")

  const updateGreeting = () => {
    const currentHour = new Date().getHours()

    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Bom dia ⛅")
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Boa tarde ☀️")
    } else {
      setGreeting("Boa noite 🌙")
    }
  }

  useEffect(() => {
    updateGreeting()
  }, [])

  return (
    <View style={styles.mainHeader}>
      <Text style={styles.bom}>{greeting}</Text>
      <View style={styles.mainHeaderContent}>
        <Text style={styles.h6}>⏰ Grupos de Alarmes</Text>
        <View style={styles.svgs}>
          <TouchableOpacity onPress={() => setModal(true)}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 4C7.12103 4 3.00003 8.121 3.00003 13C3.00003 17.879 7.12103 22 12 22C16.879 22 21 17.879 21 13C21 8.121 16.879 4 12 4ZM16 14H13V17H11V14H8.00003V12H11V9H13V12H16V14ZM17.284 3.707L18.696 2.291L21.706 5.291L20.293 6.708L17.284 3.707ZM5.28203 2.294L6.70003 3.706L3.71003 6.706L2.29303 5.293L5.28203 2.294Z"
                fill="#1B1D1F"
              />
            </Svg>
          </TouchableOpacity>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <Path
              d="M17.284 3.707L18.696 2.291L21.706 5.291L20.293 6.708L17.284 3.707ZM6.69798 3.707L3.70798 6.706L2.28998 5.294L5.27998 2.294L6.69798 3.707ZM12 4C7.12198 4 2.99998 8.121 2.99998 13C2.99998 17.879 7.12198 22 12 22C16.879 22 21 17.879 21 13C21 8.121 16.879 4 12 4ZM16 17H8.13098L12.131 11H7.99998V9H15.868L14.833 10.554L14.832 10.555L11.869 15H16V17Z"
              fill="#1B1D1F"
            />
          </Svg>
        </View>
      </View>
    </View>
  )
}

export default Header