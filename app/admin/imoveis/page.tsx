import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, MapPin, Edit, Eye, ArrowLeft, Printer, User as UserIcon } from "lucide-react";
import { DeletePropertyButton } from "@/components/admin/DeletePropertyButton";
import { CopySalesTextButton } from "@/components/admin/CopySalesTextButton";

export default async function AdminPropertiesPage() {
  const session = await getServerSession(authOptions);

  // Segurança básica: Se não estiver logado, manda pro login
  if (!session) redirect("/admin/login");

  const isAdmin = session.user.role === "ADMIN";
  const userId = session.user.id;

  // 1. Filtro de Segurança
  const where = isAdmin ? {} : { corretorId: userId };

  // 2. Busca no Banco de Dados
  // ADICIONADO: include do creci no select do corretor
  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      corretor: {
        select: {
          name: true,
          creci: true // <-- Buscando o CRECI
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {isAdmin ? "Todos os Imóveis" : "Meus Imóveis"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {isAdmin
                ? "Visão geral de todo o portfólio da imobiliária."
                : "Gerencie os anúncios criados por você."}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <ArrowLeft size={18} /> Voltar
            </Link>
            <Link href="/admin/imoveis/novo" className="bg-blue-900 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition flex items-center gap-2 font-bold shadow-md">
              <Plus size={20} /> Novo Imóvel
            </Link>
          </div>
        </div>

        {/* Lista de Imóveis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          {properties.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-full mb-4">
                <Search size={32} className="opacity-40" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Nenhum imóvel encontrado</h3>
              <p className="text-sm">Comece clicando no botão "Novo Imóvel" acima.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm w-1/3">Imóvel</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Preço</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Status</th>
                    {/* Coluna Corretor só aparece para ADMIN */}
                    {isAdmin && <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm">Corretor</th>}
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300 text-sm text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group">

                      {/* Foto e Título */}
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-600">
                            {property.fotos ? (
                              <img src={property.fotos.split(";")[0]} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-300 dark:text-gray-500 text-[10px] uppercase font-bold">Sem foto</div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1 text-sm md:text-base">{property.titulo}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={12} /> {property.bairro}, {property.cidade}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Preço */}
                      <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(property.preco)}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border
                          ${property.status === 'DISPONIVEL' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : ''}
                          ${property.status === 'PENDENTE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' : ''}
                          ${property.status === 'VENDIDO' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : ''}
                          ${property.status === 'RESERVADO' ? 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600' : ''}
                        `}>
                          {property.status}
                        </span>
                      </td>

                      {/* Corretor (Só Admin vê) */}
                      {isAdmin && (
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                              {property.corretor.name.charAt(0)}
                            </div>
                            <div>
                              <span className="block font-medium line-clamp-1">{property.corretor.name}</span>
                              {/* Exibe o CRECI se existir */}
                              {property.corretor.creci && (
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 block">
                                  CRECI: {property.corretor.creci}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Ações */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <CopySalesTextButton property={property} />
                          <Link
                            href={`/imoveis/${property.id}/print`}
                            target="_blank"
                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                            title="Imprimir Ficha (PDF)"
                          >
                            <Printer size={18} />
                          </Link>
                          {property.status === 'DISPONIVEL' && (
                            <Link href={`/imoveis/${property.id}`} target="_blank" className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded" title="Ver Página">
                              <Eye size={18} />
                            </Link>
                          )}
                          <Link href={`/admin/imoveis/editar/${property.id}`} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition" title="Editar">
                            <Edit size={18} />
                          </Link>
                          <DeletePropertyButton id={property.id} />
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}