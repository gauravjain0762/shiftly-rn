import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export type RoleType = 'company' | 'employee' | null;

const STORAGE_KEY = 'userRole';

export default function useRole() {
    const [role, setRoleState] = useState<RoleType>(null);
    const [loading, setLoading] = useState(true);

    // Load role from AsyncStorage on mount
    useEffect(() => {
        const loadRole = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored === 'company' || stored === 'employee') {
                    setRoleState(stored);
                } else {
                    setRoleState(null);
                }
            } catch (error) {
                console.error('Failed to load role', error);
            } finally {
                setLoading(false);
            }
        };

        loadRole();
    }, []);

    // Set and persist role
    const setRole = useCallback(async (newRole: RoleType) => {
        try {
            if (newRole) {
                await AsyncStorage.setItem(STORAGE_KEY, newRole);
            } else {
                await AsyncStorage.removeItem(STORAGE_KEY);
            }
            setRoleState(newRole);
        } catch (error) {
            console.error('Failed to set role', error);
        }
    }, []);

    return { role, setRole, loading };
}