import { getUserAuth } from "@/lib/services/authServices";
import { useQuery } from "@tanstack/react-query";




export function useAuth() {
    const { data: userAuth, isLoading: isLoadingAuth, isError: isErrorAuth, error: errorAuth } = useQuery({
        queryKey: ['userAuth'],
        queryFn: () => getUserAuth(),
    });

    const isAuthenticated = userAuth !== null;

    return { userAuth, isLoadingAuth, isErrorAuth, errorAuth, isAuthenticated };
}