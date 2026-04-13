

## Migration SQL — Corrigir RLS do bucket portfolio-assets

### Arquivo criado (1)
**`supabase/migrations/20260413_fix_portfolio_assets_rls.sql`**

### SQL executado via migration tool

```sql
-- Remove políticas permissivas existentes
DROP POLICY IF EXISTS "Public read access for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Public update for portfolio assets" ON storage.objects;
DROP POLICY IF EXISTS "Public delete for portfolio assets" ON storage.objects;

-- SELECT: leitura pública
CREATE POLICY "Public read access for portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- INSERT: apenas autenticados
CREATE POLICY "Authenticated upload for portfolio assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

-- UPDATE: apenas autenticados
CREATE POLICY "Authenticated update for portfolio assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio-assets');

-- DELETE: apenas autenticados
CREATE POLICY "Authenticated delete for portfolio assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio-assets');
```

### O que NÃO muda
- Nenhum arquivo `.tsx` ou `.ts`
- Nenhum outro bucket ou tabela
- Marcar finding de segurança como resolvido após execução

