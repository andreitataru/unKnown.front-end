
import { StyleSheet } from 'react-native';
import Expo, { AppLoading, Asset, Font, Constants } from 'expo';


export default styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: 'center',
    },
    containerWithGrey: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: 'flex-start'
    },
    containerWithAlign: {
        flex: 1,
        backgroundColor: "white",
        alignItems: 'center',
    },
    containerWithAlignGrey: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: 'center',
    },
    settingsMainContainer: {
        backgroundColor: "#f5f5f5",
        alignItems: 'center',
    },

    containerProfile: {
        flex: 1,
        backgroundColor: 'white',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
    },
    registerContainer: {
        alignItems: 'center',
        marginTop: -53,
    },
    loginContainer: {
        alignItems: 'center',
        marginTop: -25,
    },
    settingsContainer: {
        alignItems: 'center',
    },
    Button: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    ButtonImg: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: '5%',
    },
    ButtonLogOut: {
        alignItems: 'center',
        marginTop: 450,
        marginBottom: 5,
    },
    picture: {
        width: '100%',
        height: '90%',

    },
    welcomeImage: {
        width: 270,
        height: 120,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingImage: {
        width: 270 / 1.8,
        height: 120 / 1.8,
        resizeMode: 'contain',
        marginTop: '5%',
    },
    statusBar: {
        backgroundColor: "#000000",
        height: Constants.statusBarHeight,
    },
    SliderContainer: {
        flex: 1,
        height: 200,
        alignItems: 'center',
        marginBottom: 40,
    },
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
    },
    TextInputStyleClass: {
        textAlign: 'center',
        marginBottom: 7,
        height: 40,
        borderWidth: 10,
        borderColor: '#2196F3',
        borderRadius: 5,

    },
    Forgot: {
        textAlign: 'center',
        marginTop: 5,
        color: "grey",
        fontSize: 14,
        fontWeight: 'bold',
    },
    Matches1: {
        textAlign: 'center',
        marginTop: 30,
        color: "#444242",
        fontSize: 30,
    },
    Matches2: {
        textAlign: 'center',
        marginTop: 5,
        color: "grey",
        fontSize: 20,
    },
    containerProfilePic: {
        marginTop: '2%',
        marginLeft: '2%',
        height: 200,
        width: '45%',
        backgroundColor: 'black',
    },
    TextComponentStyle: {
        fontSize: 20,
        color: "#444242",
        textAlign: 'center',
        marginBottom: 15,
    },
    textLogin: {
        fontSize: 18,
        color: "#444242",
        textAlign: 'left',
    },
    token1: {
        fontSize: 22,
        color: "#444242",
        textAlign: 'left',
        marginBottom: 10,
    },
    DatePickerStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    DatePickerButton: {
        backgroundColor: '#18e794',
    },
    TextCreateAcc: {
        fontSize: 32,
        color: "#444242",
        textAlign: 'center',
        marginBottom: 15,
    },
    TextDate: {
        fontSize: 23,
        color: "#444242",
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: 'bold',
    },
    littleInfoText: {
        color: 'grey',
        fontSize: 11,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    versionText: {
        color: 'grey',
        fontSize: 11,
        textAlign: 'center',
    },
    mediumInfoText: {
        color: 'grey',
        fontSize: 12,
        textAlign: 'center',
    },
    mediumPlusInfoText: {
        color: 'grey',
        fontSize: 15,
        textAlign: 'left',
    },
    textEmailConfirm: {
        color: 'grey',
        fontSize: 20,
        textAlign: 'center',
    },
    userNameAgeStyle: {
        fontSize: 25,
        color: "#444242",
        textAlign: 'center',
        fontWeight: 'normal',
    },
    publifProfInfo: {
        color: 'grey',
        fontSize: 15,
        textAlign: 'left',
        marginLeft: '1%'
    },
    userNameAgeStyleProf: {
        fontSize: 25,
        color: "#444242",
        textAlign: 'left',
        fontWeight: 'normal',
        paddingLeft: '1%',
    },
    userNameAgeEdit: {
        fontSize: 24,
        color: "#444242",
        textAlign: 'left',
        fontWeight: 'normal',
        paddingLeft: '1%',
    },
    editbioView: {
        marginLeft: '2%',
        marginTop: '4%'
    },
    about: {
        fontSize: 16,
        color: "#444242",
        textAlign: 'left',
        marginLeft: '1%',
        fontWeight: 'bold',
    },
    InputAbout: {
        textAlign: 'left',
        marginLeft: '2%',
    },
    inputView: {
        flex: 1,
        marginLeft: '-1%',
        backgroundColor: 'white'
    },
    big: {
        height: 500
    },
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        margin: 10,
        backgroundColor: '#fff',
    },
    TextInputStyleClass: {
        textAlign: 'center',
        marginBottom: 7,
        marginLeft: 30,
        marginRight: 30,
        height: 40,
        borderWidth: 1,
        borderColor: '#18e794',
        borderRadius: 5,
    },
    TextComponentStyle: {
        fontSize: 15,
        color: "#444242",
        textAlign: 'left',
        marginBottom: 10,
        marginTop: 5,
        marginLeft: 30
    },
    Button: {
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    ButtonCamera: {
        alignItems: 'center',
        marginTop: '-30%',
        marginBottom: 5,
    },
    touchable: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 230,
        height: 40,
        backgroundColor: '#18e794',
        borderRadius: 100,
    },
    touchableLogin: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 230,
        height: 40,
        backgroundColor: '#18e794',
        borderRadius: 100,
        flexDirection: 'row'
    },
    touchableCameraN: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 230,
        height: 40,
        backgroundColor: '#18e794',
        borderRadius: 100,
        flexDirection: 'row',
        marginBottom: '5%'
    },
    pickDateTouchable: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 230,
        height: 40,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#18e794',
        borderRadius: 100,
    },
    touchableSettings: {
        alignItems: 'center',
        width: 230,
        height: 40,
        backgroundColor: '#18e794',
        borderRadius: 100,
        marginBottom: '8%',
        flexDirection: 'row',
    },
    loginStuff: {
        flexDirection: 'row',
    },
    iconLeft: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    iconLeftLast: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: '2%',
    },
    iconsEditProf: {
        flexDirection: 'row',
        backgroundColor: 'white',
        //marginLeft: '70%',
    },
    bio: {
        flexDirection: 'row',
        marginTop: '4%',
        marginLeft: '1%',
        marginBottom: '4%',
    },
    touchableSettingsDiscovery: {
        alignItems: 'center',
        width: 230,
        height: 40,
        backgroundColor: '#18e794',
        borderRadius: 100,
        marginBottom: '4%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    touchableSettingsLast: {
        alignItems: 'center',
        width: 230,
        height: 40,
        backgroundColor: '#18e794',
        borderRadius: 100,
        flexDirection: 'row',
        marginBottom: '2%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: '27%'
    },
    buttonTextDiscovery: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: '33%'
    },
    buttonTextWithRightSpace: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        paddingRight: 7,
        marginLeft: '27%',
    },
    buttonTextWithRightSpace2: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        paddingRight: 7,
        marginLeft: '22%',
    },
    buttonTextWithRightSpace3: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        paddingRight: 7,
        marginLeft: '35%',
    },
    imageContainer: {
        height: 180,
        width: 180,
        borderRadius: 90
    },
    imagestyle: {
        marginTop: '5%',
        marginBottom: '5%',
        width: 180,
        height: 180,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 90,
    },
    card: {
        backgroundColor: 'rgba(20, 20, 20, 0.2)',
        flex: 0.8,
        width: 270,
        borderRadius: 20,
        padding: 20,
        shadowColor: 'rgb(20, 20, 20)',
        shadowOffset: { width: -2, height: 5 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
    },
    calendar: {
        marginTop: '-5%',
        marginLeft: '15%',
        marginRight: '28%',
        marginBottom: '5%',
        width: 35,
        height: 55,
        backgroundColor: '#fff',
        borderRadius: 75,
        alignItems: 'center'
    },
    Settings: {
        marginTop: '5%',
        marginBottom: '5%',
        marginLeft: '20%',
        marginRight: '28%',
        width: 52,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 75,
        alignItems: 'center'
    },
    info: {
        marginTop: '5%',
        marginBottom: '5%',
        marginLeft: '3%',
        width: 60,
        height: 80,
        backgroundColor: '#fff',
        borderRadius: 75,
        alignItems: 'center'
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#F5FCFF88',
        justifyContent: 'center'
    },
})
