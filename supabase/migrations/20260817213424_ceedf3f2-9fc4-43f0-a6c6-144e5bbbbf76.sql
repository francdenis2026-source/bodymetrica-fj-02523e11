DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Try to find a user to make admin for testing
    SELECT id INTO target_user_id FROM auth.users LIMIT 1;
    
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;
