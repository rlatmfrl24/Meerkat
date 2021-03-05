import 'semantic-ui-css/semantic.min.css'
import { AppProps } from 'next/app'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useRecoilSnapshot
} from 'recoil';
import { useEffect } from "react"

export default function App({ Component, pageProps }: AppProps) {

  return (
    <RecoilRoot>
      <DebugObserver />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

function DebugObserver() {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({isModified: true})) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}