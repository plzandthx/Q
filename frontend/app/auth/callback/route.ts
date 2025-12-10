import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/app';

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user profile exists, if not create one
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        // Create user profile for OAuth users
        const name = data.user.user_metadata?.name ||
                     data.user.user_metadata?.full_name ||
                     data.user.email?.split('@')[0] ||
                     'User';

        await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email!,
          name,
          avatar_url: data.user.user_metadata?.avatar_url,
          auth_provider: data.user.app_metadata?.provider === 'google' ? 'GOOGLE' : 'PASSWORD',
          email_verified: true,
        });

        // Create default organization
        const orgSlug = data.user.email?.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-') || 'user';
        const { data: orgData } = await supabase
          .from('organizations')
          .insert({
            name: `${name}'s Organization`,
            slug: `${orgSlug}-${Date.now()}`,
          })
          .select()
          .single();

        if (orgData) {
          await supabase.from('org_memberships').insert({
            organization_id: orgData.id,
            user_id: data.user.id,
            role: 'OWNER',
          });
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to sign-in page with error
  return NextResponse.redirect(`${origin}/auth/sign-in?error=Could not authenticate user`);
}
