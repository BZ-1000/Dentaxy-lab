import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { broadcastMessage } from '@/lib/admin-api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2, Send } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(2, {
        message: "El título debe tener al menos 2 caracteres.",
    }),
    content: z.string().min(10, {
        message: "El mensaje debe tener al menos 10 caracteres.",
    }),
    targetAudience: z.enum(['global', 'shop_users', 'seed_users', 'students', 'admins']),
    messageType: z.enum(['popup', 'banner', 'notification', 'email']),
});

interface BroadcastMessageFormProps {
    onSuccess?: () => void;
}

export function BroadcastMessageForm({ onSuccess }: BroadcastMessageFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            targetAudience: "global",
            messageType: "popup",
        },
    });

    const mutation = useMutation({
        mutationFn: broadcastMessage,
        onSuccess: () => {
            toast.success("Mensaje enviado correctamente a la cola de broadcast");
            form.reset();
            queryClient.invalidateQueries({ queryKey: ['broadcast_messages'] });
            if (onSuccess) onSuccess();
        },
        onError: (error) => {
            toast.error(`Error al enviar mensaje: ${error.message}`);
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título del Mensaje</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Mantenimiento Programado" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Audiencia Objetivo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar audiencia" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="global">Todos los Usuarios (Global)</SelectItem>
                                    <SelectItem value="shop_users">Usuarios de Shop</SelectItem>
                                    <SelectItem value="seed_users">Usuarios de Seed</SelectItem>
                                    <SelectItem value="students">Estudiantes</SelectItem>
                                    <SelectItem value="admins">Administradores</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="messageType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Mensaje</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="popup">Popup Modal (Intrusivo)</SelectItem>
                                    <SelectItem value="banner">Banner Superior (Informativo)</SelectItem>
                                    <SelectItem value="notification">Notificación Toast (Efímero)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contenido del Mensaje</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Escribe el contenido del mensaje aquí..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full font-bold" disabled={mutation.isPending}>
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando Broadcast...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Broadcast
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}
