import React from "react";
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Alert,
} from "react-native";

const ServiceHistoryScreen = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [startAfter, setStartAfter] = React.useState(null);
  const [lastItem, setLastItem] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  React.useEffect(() => {
    // Aquí puedes colocar tu lógica para obtener datos
    setIsLoading(false);
  }, [isRefreshing]);

  const onRefresh = () => {
    setIsRefreshing(true);
  };

  const getMoreData = () => {
    if (!lastItem && startAfter) {
      setIsLoading(true);
      // lógica para paginación
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => { /* navegación u otra acción */ }}>
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#aaa" />
        </View>
      ) : (
        <>
          {data.length > 0 ? (
            <SafeAreaView style={styles.mainContainer}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={getMoreData}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderLoader}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    colors={["#aaa"]}
                    tintColor={"#aaa"}
                  />
                }
              />
            </SafeAreaView>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No hay datos disponibles</Text>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default ServiceHistoryScreen;

const styles = StyleSheet.create({
  mainContainer: {},
  container: {},
  itemContainer: {},
  title: {},
  subtitle: {},
  loader: {},
  noDataContainer: {},
  noDataText: {},
});
