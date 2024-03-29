import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

import { Entypo } from '@expo/vector-icons'

import { GameParams } from '../../@types/navigation';

import { styles } from './styles';
import { THEME } from '../../theme';
import logoImg from '../../assets/logo-nlw-esports.png'

import { Heading } from '../../components/Heading';
import { DuoMatch} from '../../components/DuoMatch';
import { Background } from '../../components/Background';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { CheckCircle } from 'phosphor-react-native';




export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discDuoSelected, setDiscDuoSelected] = useState('');


  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoBack() {
      navigation.goBack();
  }
  
  async function getDiscordUser (adsId: string) {
    fetch(`http://10.0.0.74:3333/ads/${adsId}/discord`)
    .then(response => response.json())
    .then(data => setDiscDuoSelected(data.discord)); 
  }

  useEffect(() => {
    fetch(`http://10.0.0.74:3333/games/${game.id}/ads`)
    .then(response => response.json())
    .then(data => setDuos(data)); 
  }, [])

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>

          <TouchableOpacity onPress = {handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20} 
            />
          </TouchableOpacity>

          <Image
            source={logoImg}
            style={styles.logo}
            resizeMode="cover" 
          />

          <View style={styles.right}/>
        </View>
        <Image
         source = {{uri: game.banneruRL}}
         style={styles.cover}
        />
        <Heading
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        /> 
      <FlatList 
        data={duos}
        keyExtractor={item => item.id}
        renderItem = {({ item }) => (
          <DuoCard 
          data = {item}
          onConnect={() => getDiscordUser(item.id)} 
          />
        )}
        horizontal
        style={styles.containerList}
        contentContainerStyle={[, duos.length > 0 ? styles.contentList : styles.emptyListContent]}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            Não há anuncios publicados ainda.
          </Text>
        )}
      />

        <DuoMatch 
          visible={discDuoSelected.length > 0}
          discord={discDuoSelected}
          onClose={() => setDiscDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
  );
}