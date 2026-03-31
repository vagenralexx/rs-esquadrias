# Componentes UI Reutilizáveis

Biblioteca de componentes React + Tailwind CSS seguindo as melhores práticas de UI/UX, acessibilidade e responsividade.

## Componentes Disponíveis

### Button

Botão com múltiplas variantes, tamanhos e estado de loading.

```tsx
import { Button } from './components/ui'

<Button variant="primary" size="md" onClick={handleClick}>
  Clique aqui
</Button>

<Button variant="outline" loading>
  Carregando...
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean
- Todas as props nativas de `<button>`

### Card

Sistema de cards composable para layouts consistentes.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './components/ui'

<Card hover>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo aqui
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>
```

### ResponsiveImage

Imagem com fallback automático e lazy loading.

```tsx
import { ResponsiveImage } from './components/ui'

<ResponsiveImage
  src="/path/to/image.jpg"
  alt="Descrição da imagem"
  className="w-full h-64 object-cover rounded-lg"
  fallbackText="Imagem não disponível"
/>
```

### Skeleton

Loading placeholders para melhor UX.

```tsx
import { Skeleton, SkeletonCard } from './components/ui'

// Skeleton simples
<Skeleton className="h-4 w-3/4" />

// Card completo
<SkeletonCard />
```

### DarkModeToggle

Toggle para alternar entre modo claro e escuro.

```tsx
import { DarkModeToggle } from './components/ui'

<DarkModeToggle />
```

## Hook: useDarkMode

Hook para gerenciar o estado do dark mode.

```tsx
import { useDarkMode } from './hooks/useDarkMode'

function MyComponent() {
  const { isDark, toggle } = useDarkMode()
  
  return (
    <button onClick={toggle}>
      {isDark ? 'Modo Claro' : 'Modo Escuro'}
    </button>
  )
}
```

## Configuração do Dark Mode

O dark mode está configurado no Tailwind com a estratégia `class`:

```js
// tailwind.config.js
export default {
  darkMode: 'class',
  // ...
}
```

Para usar dark mode em seus componentes:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Conteúdo que se adapta ao tema
</div>
```

## Princípios de Design

### 1. Mobile-First
Todos os componentes são projetados mobile-first e escalam para desktop.

### 2. Acessibilidade
- Uso de HTML semântico
- ARIA labels onde necessário
- Suporte a navegação por teclado
- Indicadores de foco visíveis

### 3. Performance
- Lazy loading de imagens
- Code splitting quando apropriado
- Transições otimizadas

### 4. Consistência
- Escala de espaçamento Tailwind
- Paleta de cores definida
- Tipografia responsiva

## Exemplos de Uso

### Formulário com Loading

```tsx
function ContactForm() {
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // ... lógica de envio
    setLoading(false)
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entre em Contato</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {/* campos do formulário */}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" loading={loading} fullWidth>
          Enviar
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Grid de Cards com Loading

```tsx
function ProductGrid() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <Card key={product.id} hover>
          <ResponsiveImage
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <CardContent>
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
          </CardContent>
          <CardFooter>
            <Button variant="primary" fullWidth>
              Ver Detalhes
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
```

## Customização

Todos os componentes aceitam `className` para customização adicional:

```tsx
<Button className="shadow-2xl transform hover:scale-105">
  Botão Customizado
</Button>
```

## Cores do Tema

As cores principais estão definidas no `tailwind.config.js`:

```js
colors: {
  brand: {
    primary: '#FF6B00',
    secondary: '#000000',
  }
}
```

Use como:

```tsx
<div className="bg-brand-primary text-white">
  Usando cor da marca
</div>
```
