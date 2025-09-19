import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const { client_id_param } = await req.json()

    if (!client_id_param) {
      return new Response(
        JSON.stringify({ error: 'client_id_param is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get projects with aggregated task stats
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select(`
        *,
        consultant:user_profiles!projects_consultant_id_fkey(full_name, email)
      `)
      .eq('client_id', client_id_param)
      .order('created_at', { ascending: false })

    if (projectsError) {
      return new Response(
        JSON.stringify({ error: projectsError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get task stats for each project
    const projectsWithStats = await Promise.all(
      (projects || []).map(async (project) => {
        const { data: taskStats } = await supabase
          .from('tasks')
          .select('id, status, actual_hours')
          .eq('project_id', project.id)
          .eq('is_client_visible', true)

        const totalTasks = taskStats?.length || 0
        const completedTasks = taskStats?.filter(t => t.status === 'completed').length || 0
        const totalHours = taskStats?.reduce((sum, t) => sum + (t.actual_hours || 0), 0) || 0

        return {
          ...project,
          task_stats: {
            total_tasks: totalTasks,
            completed_tasks: completedTasks,
            total_hours: totalHours
          }
        }
      })
    )

    return new Response(
      JSON.stringify(projectsWithStats),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})