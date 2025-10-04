'use client';
import { EyeOffIcon, EyeIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { JSX, useState } from 'react';
import { Box } from '@/components/ui/box';

type PasswordFieldProps = {
  name?: string;
  label?: string;
  placeholder?: string;
  description?: string | JSX.Element;
  disabled?: boolean;
};

export function PasswordField({
  disabled,
  label = 'Password',
  name = 'password',
  placeholder = 'Enter password',
  description
}: PasswordFieldProps) {
  const { control, getFieldState } = useFormContext();
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Box className='relative'>
              <Input
                disabled={disabled}
                type={passwordVisibility ? 'text' : 'password'}
                autoComplete='on'
                placeholder={placeholder}
                className={`pr-12 ${getFieldState(name).error && 'text-destructive'}`}
                {...field}
              />
              <button
                type='button'
                className='text-muted-foreground absolute inset-y-0 right-0 flex cursor-pointer items-center p-3'
                onClick={() => setPasswordVisibility(!passwordVisibility)}
                aria-label={
                  passwordVisibility ? 'Hide password' : 'Show password'
                }
              >
                {passwordVisibility ? (
                  <EyeOffIcon className='size-5' />
                ) : (
                  <EyeIcon className='size-5' />
                )}
              </button>
            </Box>
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}
