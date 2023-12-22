// api.js
import useAuth from "@/hooks/useAuth";

const { handlers: {GET, POST} } = useAuth();

export { GET, POST };
