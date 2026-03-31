# 📚 Exemplos Práticos de Uso dos Componentes

## Button Examples

### Variantes

```tsx
import { Button } from './components/ui'

// Primary (padrão)
<Button variant="primary">
  Botão Principal
</Button>

// Secondary
<Button variant="secondary">
  Botão Secundário
</Button>

// Outline
<Button variant="outline">
  Botão com Borda
</Button>

// Ghost
<Button variant="ghost">
  Botão Transparente
</Button>
```

### Tamanhos

```tsx
// Pequeno
<Button size="sm">Pequeno</Button>

// Médio (padrão)
<Button size="md">Médio</Button>

// Grande
<Button size="lg">Grande</Button>
```

### Estados

```tsx
// Loading
<Button loading>Carregando...</Button>

// Disabled
<Button disabled>Desabilitado</Button>

// Full Width
<Button fullWidth>Largura Total</Button>
```

### Com Ícones

```tsx
import { Send, Download, Trash2 } from 'lucide-react'

<Button>
  <Send className="w-4 h-4" />
  Enviar
</Button>

<Button variant="secondary">
  <Download className="w-4 h-4" />
  Baixar
</Button>

<Button variant="outline">
  <Trash2 className="w-4 h-4" />
  Excluir
</Button>
```

## Card Examples

### Card Básico

```tsx
import { Card, CardContent } from './components/ui'

<Card>
  <CardContent>
    Conteúdo simples do card
  </CardContent>
</Card>
```

### Card Completo

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from './components/ui'

<Card hover>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-gray-600 dark:text-gray-400">
      Descrição detalhada do conteúdo do card.
    </p>
  </CardContent>
  <CardFooter>
    <Button variant="primary">Ação Principal</Button>
    <Button variant="ghost">Cancelar</Button>
  </CardFooter>
</Card>
```

### Card de Produto

```tsx
import { Card, CardContent, CardFooter, Button, ResponsiveImage } from './components/ui'
import { ShoppingCart } from 'lucide-react'

<Card hover className="max-w-sm">
  <ResponsiveImage
    src="/produto.jpg"
    alt="Nome do Produto"
    className="w-full h-48 object-cover"
  />
  <CardContent>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
      Nome do Produto
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Descrição breve do produto
    </p>
    <p className="text-2xl font-bold text-[#FF6B00]">
      R$ 99,90
    </p>
  </CardContent>
  <CardFooter>
    <Button fullWidth>
      <ShoppingCart className="w-4 h-4" />
      Adicionar ao Carrinho
    </Button>
  </CardFooter>
</Card>
```

### Card de Estatística

```tsx
import { Card, CardContent } from './components/ui'
import { TrendingUp, Users, DollarSign } from 'lucide-react'

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card hover>
    <CardContent className="flex items-center gap-4">
      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
        <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Usuários</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,234</p>
      </div>
    </CardContent>
  </Card>
  
  <Card hover>
    <CardContent className="flex items-center gap-4">
      <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
        <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Receita</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">R$ 45,6K</p>
      </div>
    </CardContent>
  </Card>
  
  <Card hover>
    <CardContent className="flex items-center gap-4">
      <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
        <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Crescimento</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">+23%</p>
      </div>
    </CardContent>
  </Card>
</div>
```

## ResponsiveImage Examples

### Imagem Básica

```tsx
import { ResponsiveImage } from './components/ui'

<ResponsiveImage
  src="/imagem.jpg"
  alt="Descrição da imagem"
  className="w-full h-64 object-cover rounded-lg"
/>
```

### Imagem com Fallback Customizado

```tsx
<ResponsiveImage
  src="/imagem-que-pode-falhar.jpg"
  alt="Projeto RS Esquadrias"
  fallbackText="Projeto em andamento"
  className="w-full aspect-video object-cover rounded-xl"
/>
```

### Grid de Imagens

```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {images.map((img, i) => (
    <ResponsiveImage
      key={i}
      src={img.url}
      alt={img.alt}
      className="w-full aspect-square object-cover rounded-lg hover:scale-105 transition-transform"
    />
  ))}
</div>
```

## Skeleton Examples

### Loading de Texto

```tsx
import { Skeleton } from './components/ui'

<div className="space-y-3">
  <Skeleton className="h-8 w-3/4" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
</div>
```

### Loading de Card

```tsx
import { SkeletonCard } from './components/ui'

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <SkeletonCard />
  <SkeletonCard />
  <SkeletonCard />
</div>
```

### Loading Customizado

```tsx
import { Skeleton } from './components/ui'

<div className="flex items-center gap-4">
  <Skeleton variant="circular" className="w-16 h-16" />
  <div className="flex-1 space-y-2">
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-3 w-3/4" />
  </div>
</div>
```

## Dark Mode Examples

### Toggle Simples

```tsx
import { DarkModeToggle } from './components/ui'

<DarkModeToggle />
```

### Hook Customizado

```tsx
import { useDarkMode } from './hooks/useDarkMode'
import { Moon, Sun } from 'lucide-react'

function CustomToggle() {
  const { isDark, toggle } = useDarkMode()
  
  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
    </button>
  )
}
```

### Componente com Dark Mode

```tsx
function MyComponent() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        Título
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Texto que se adapta ao tema
      </p>
      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        Conteúdo destacado
      </div>
    </div>
  )
}
```

## Padrões Compostos

### Formulário de Contato

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from './components/ui'
import { useState } from 'react'

function ContactForm() {
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Lógica de envio
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Entre em Contato</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Nome
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF6B00] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF6B00] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Mensagem
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#FF6B00] focus:outline-none"
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" loading={loading} fullWidth>
          Enviar Mensagem
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Lista com Loading

```tsx
import { Card, CardContent, SkeletonCard, ResponsiveImage } from './components/ui'
import { useEffect, useState } from 'react'

function ProductList() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setProducts([/* dados */])
      setLoading(false)
    }, 2000)
  }, [])
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <SkeletonCard key={i} />
        ))}
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
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
              {product.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {product.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### Modal com Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from './components/ui'
import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="relative max-w-md w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary">
            Confirmar
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
```

## Dicas de Uso

### 1. Sempre use className para customização adicional
```tsx
<Button className="shadow-2xl">Customizado</Button>
```

### 2. Combine componentes para criar padrões complexos
```tsx
<Card>
  <ResponsiveImage />
  <CardContent>
    <Skeleton /> {/* enquanto carrega */}
  </CardContent>
</Card>
```

### 3. Use dark mode em todos os componentes customizados
```tsx
<div className="bg-white dark:bg-gray-900">
  {/* conteúdo */}
</div>
```

### 4. Mantenha consistência com a paleta de cores
```tsx
// Use as cores do tema
<div className="text-brand-primary bg-brand-secondary">
```

### 5. Sempre adicione estados de loading
```tsx
{loading ? <SkeletonCard /> : <Card>{content}</Card>}
```
