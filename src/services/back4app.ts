import Parse from 'parse';

if (!Parse.applicationId) {
  Parse.initialize(
    process.env.NEXT_PUBLIC_PARSE_APPLICATION_ID as string,
    process.env.NEXT_PUBLIC_PARSE_JAVASCRIPT_KEY as string
  );

  Parse.serverURL = 'https://parseapi.back4app.com/';

  if (typeof window !== 'undefined') {
    Parse.setAsyncStorage(window.localStorage);
  }
}

export default Parse;