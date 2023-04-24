export default function SearchScreen({ navigator }) {
    const [isLoading, setIsLoading] = React.useState(true);

    const getData = () => {
        setIsLoading(true);
        AsyncStorage.getItem('user', (errs, user) => {
            (user) ? setIsLogin(true) : setIsLogin(false);
        }).finally(() => setIsLoading(false));
    }

    React.useEffect(checkLogin, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
            </View>
        )
    }
}