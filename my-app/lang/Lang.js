import CN from './cn';
import EN from './en';
class Lang {
    translate = (string) => {
        // let systemLang = typeof window !== 'undefined' ? localStorage.getItem('systemLang') : 'cn';
        let systemLang = 'cn';
        if (systemLang == 'cn' && CN[string]) {
            return CN[string];
        }
        else if (systemLang == 'en' && EN[string]) {
            return EN[string];
        }
        else {
            return string;
        }
    };

}
const Language = new Lang();
export default Language;
