import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Modal,
} from "react-native";
import TimePicker from "./components/TimePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Switch } from "react-native-paper";
import { useFonts } from "expo-font";
import { styles } from "./styles";
import Header from "./components/Header";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";

const Home = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "nunito-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "nunito-medium": require("./assets/fonts/Nunito-Medium.ttf"),
  });
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [currentGroupId, setCurrentGroupId] = useState(null);
  const [modalAlarmVisible, setModalAlarmVisible] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [time, setTime] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes());
  const todosOsDias = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  // Função para converter hora em minutos
  const converterHoraParaMinutos = (hora) => {
    const [horas, minutos] = hora.split(":").map(Number);
    return horas * 60 + minutos;
  };

  // Função para converter minutos em hora
  const converterMinutosParaHora = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  // Função para toggle do switch
  const toggleSwitch = (itemId) => {
    const newData = data.map((item) => {
      if (item.id === itemId) {
        return { ...item, grupoAtivo: !item.grupoAtivo };
      }
      return item;
    });
    setData(newData);
  };

  // Função para salvar dados no AsyncStorage
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("@data_key", jsonValue);
    } catch (e) {
      console.error("Erro ao salvar os dados", e);
    }
  };

  // Função para carregar dados do AsyncStorage
  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@data_key");
      if (jsonValue != null) {
        setData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Erro ao carregar os dados", e);
    }
  };

  // Função para adicionar novo grupo
  const addGroup = () => {
    const newGroup = {
      id: Date.now(),
      nome: groupName,
      alarmes: [],
      grupoAtivo: true,
    };
    const newData = [...data, newGroup];
    setData(newData);
    storeData(newData);

    setCurrentGroupId(newGroup.id); // Armazenar o ID do novo grupo

    openAlarmModal();
    setModalVisible(false);
    setGroupName("");
  };

  // Função para fechar o modal de criação de grupo
  const closeModal = () => {
    setModalVisible(false);
    setGroupName(""); // Reseta o nome do grupo apenas ao fechar o modal
  };

  const onDiasSelecionadosChange = (novosDias) => {
    setDiasSelecionados(novosDias);
  };

  const openAlarmModal = () => {
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    setSelectedHour(currentHour);
    setSelectedMinute(currentMinute);
    setHr(currentHour);
    setMin(currentMinute);
    setModalAlarmVisible(true);
  };

  const addAlarm = (currentGroup) => {
    const newAlarm = {
      id: Date.now(),
      nome: `${Date.now()}`,
      hora: `${hr.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}`,
      ativo: true,
      dias: diasSelecionados,
    };

    // Atualizar o estado com o novo alarme
    setData(
      data.map((group) => {
        if (group.id === currentGroupId) {
          return {
            ...group,
            alarmes: [...group.alarmes, newAlarm],
          };
        }
        return group;
      })
    );
    // scheduleNotification(newAlarm);
    setModalAlarmVisible(false);
  };

  // Carrega dados ao inicializar
  useEffect(() => {
    loadData();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const [hr, setHr] = useState();
  const [min, setMin] = useState();

  const handleTimeChange = (hour, minute) => {
    const newHour = hour !== undefined ? hour : selectedHour;
    const newMinute = minute !== undefined ? minute : selectedMinute;

    setSelectedHour(newHour);
    setSelectedMinute(newMinute);
    setHr(newHour);
    setMin(newMinute);

    console.log(`Hora selecionada: ${newHour}:${newMinute}`);
  };

  const desativarTodosOsGrupos = () => {
    const newData = data.map((grupo) => ({ ...grupo, grupoAtivo: false }));
    setData(newData);
    storeData(newData);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header
        setModal={setModalVisible}
        onDesativarTodosGrupos={desativarTodosOsGrupos}
      />
      <ScrollView style={styles.scroll}>
        {data.length === 0 ? (
          <View style={styles.noGroupAlarmsTouch}>
            <Text style={styles.noGroupAlarmsTitle}>
              Nenhum grupo de alarmes criado
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.noGroupAlarmsTouch}
            >
              <Text style={styles.noAlarmsText}>
                Clique no ícone para criar um
              </Text>
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 4C7.12103 4 3.00003 8.121 3.00003 13C3.00003 17.879 7.12103 22 12 22C16.879 22 21 17.879 21 13C21 8.121 16.879 4 12 4ZM16 14H13V17H11V14H8.00003V12H11V9H13V12H16V14ZM17.284 3.707L18.696 2.291L21.706 5.291L20.293 6.708L17.284 3.707ZM5.28203 2.294L6.70003 3.706L3.71003 6.706L2.29303 5.293L5.28203 2.294Z"
                  fill="#1B1D1F"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.alarms}>
            {data.map((item) => {
              const alarmesAtivosMinutos = item.alarmes
                .filter((alarme) => alarme.ativo)
                .map((alarme) => converterHoraParaMinutos(alarme.hora));

              let horarioInicio, horarioFim;
              if (alarmesAtivosMinutos.length > 0) {
                const menorHora = Math.min(...alarmesAtivosMinutos);
                const maiorHora = Math.max(...alarmesAtivosMinutos);
                horarioInicio = converterMinutosParaHora(menorHora);
                horarioFim = converterMinutosParaHora(maiorHora);
              } else {
                horarioInicio = "";
                horarioFim = "";
              }

              return (
                <View key={item.id} style={styles.alarm}>
                  <TouchableOpacity
                    style={styles.touchAlarm}
                    onPress={() =>
                      navigation.navigate("AlarmGroup", {
                        group: item,
                        data: data,
                        storeData: storeData,
                      })
                    }
                  >
                    <View style={styles.alarmInfo}>
                      <Text style={styles.alarmTitle}>{item.nome}</Text>
                      <Text style={styles.overline}>
                        {item.alarmes.filter((alarme) => alarme.ativo).length}{" "}
                        Alarmes ativos de {item.alarmes.length}
                      </Text>
                      <Text
                        style={styles.caption}
                      >{`${horarioInicio} - ${horarioFim}`}</Text>
                    </View>
                    <View style={styles.alarmDias}>
                      {todosOsDias.map((diaSemana, index) => {
                        const diaAtivo = item.alarmes.some(
                          (alarme) =>
                            alarme.ativo && alarme.dias.includes(diaSemana)
                        );
                        return (
                          <View key={index} style={styles.alarmDia}>
                            <Text style={styles.alarmOverline}>
                              {diaSemana[0]}
                            </Text>
                            {diaAtivo && <View style={styles.after} />}
                          </View>
                        );
                      })}
                    </View>
                  </TouchableOpacity>
                  <TouchableWithoutFeedback
                    onPress={() => toggleSwitch(item.id)}
                  >
                    <View style={styles.switchView}>
                      <Switch
                        value={item.grupoAtivo}
                        onValueChange={() => toggleSwitch(item.id)}
                        style={styles.switch}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalTitle}>
              <Text style={styles.modalText}>Criar Grupo de alarmes</Text>
              <TextInput
                style={styles.input}
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Nome do Grupo"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.buttonClose}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addGroup}>
                <Text style={styles.buttonCreate}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAlarmVisible}
        onRequestClose={() => {
          setModalAlarmVisible(!modalAlarmVisible);
        }}
      >
        <View style={styles.modalAlarm}>
          <View style={styles.modaAlarmlView}>
            <TimePicker
              addAlarm={addAlarm}
              alarm={modalAlarmVisible}
              setAlarm={setModalAlarmVisible}
              onTimeSelected={handleTimeChange}
              todosDias={todosOsDias}
              onDiasSelecionadosChange={onDiasSelecionadosChange}
              currentHour={hr}
              currentMinute={min}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;